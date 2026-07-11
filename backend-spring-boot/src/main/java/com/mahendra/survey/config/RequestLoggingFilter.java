package com.mahendra.survey.config;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.stereotype.Component;
import org.springframework.util.StreamUtils;

import jakarta.servlet.Filter;
import jakarta.servlet.FilterChain;
import jakarta.servlet.ReadListener;
import jakarta.servlet.ServletException;
import jakarta.servlet.ServletInputStream;
import jakarta.servlet.ServletOutputStream;
import jakarta.servlet.ServletRequest;
import jakarta.servlet.ServletResponse;
import jakarta.servlet.WriteListener;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import java.io.IOException;
import java.io.PrintWriter;
import java.nio.charset.StandardCharsets;
import java.util.Enumeration;
import java.util.HashMap;
import java.util.Map;

@Component
public class RequestLoggingFilter implements Filter {

    private static final Logger LOGGER = LoggerFactory.getLogger(RequestLoggingFilter.class);

    @Override
    public void doFilter(ServletRequest request, ServletResponse response, FilterChain chain)
            throws IOException, ServletException {

        HttpServletRequest httpRequest = (HttpServletRequest) request;

        // Skip logging for H2 console to avoid interference
        if (httpRequest.getRequestURI().startsWith("/h2-console")) {
            chain.doFilter(request, response);
            return;
        }

        long startTime = System.currentTimeMillis();

        HttpServletResponse httpResponse = (HttpServletResponse) response;

        // Wrap request and response to capture bodies
        CachedRequestWrapper requestWrapper = new CachedRequestWrapper(httpRequest);
        CachedResponseWrapper responseWrapper = new CachedResponseWrapper(httpResponse);

        try {
            // Proceed with the filter chain
            chain.doFilter(requestWrapper, responseWrapper);
        } finally {
            long duration = System.currentTimeMillis() - startTime;
            int status = responseWrapper.getStatus();

            String logMessage = buildLogMessage(httpRequest, requestWrapper, responseWrapper, status, duration);

            if (status >= 400) {
                LOGGER.error(logMessage);
            } else {
                LOGGER.info(logMessage);
            }

            // Write the cached response body to the actual response
            byte[] responseBody = responseWrapper.getBody().getBytes(StandardCharsets.UTF_8);
            response.getOutputStream().write(responseBody);
        }
    }

    private String buildLogMessage(HttpServletRequest request, CachedRequestWrapper requestWrapper,
                                   CachedResponseWrapper responseWrapper, int status, long duration) {
        StringBuilder sb = new StringBuilder();
        sb.append(request.getMethod()).append(" ").append(request.getRequestURI());

        // Query params
        String queryString = request.getQueryString();
        if (queryString != null) {
            sb.append("?").append(queryString);
        }

        sb.append(" - Status: ").append(status).append(" - Duration: ").append(duration).append("ms");

        if (status >= 400) {
            // Add extra details for errors
            sb.append(" - Headers: ").append(getHeadersAsString(request));
            sb.append(" - Request Body: ").append(requestWrapper.getBody());
            sb.append(" - Response Body: ").append(responseWrapper.getBody());
        }

        return sb.toString();
    }

    private String getHeadersAsString(HttpServletRequest request) {
        Map<String, String> headers = new HashMap<>();
        Enumeration<String> headerNames = request.getHeaderNames();
        while (headerNames.hasMoreElements()) {
            String name = headerNames.nextElement();
            String value = request.getHeader(name);
            headers.put(name, value);
        }
        return headers.toString();
    }

    // Wrapper to cache request body
    private static class CachedRequestWrapper extends jakarta.servlet.http.HttpServletRequestWrapper {
        private final String body;

        public CachedRequestWrapper(HttpServletRequest request) throws IOException {
            super(request);
            this.body = StreamUtils.copyToString(request.getInputStream(), StandardCharsets.UTF_8);
        }

        public String getBody() {
            return body;
        }

        @Override
        public ServletInputStream getInputStream() throws IOException {
            return new CachedServletInputStream(body.getBytes(StandardCharsets.UTF_8));
        }
    }

    // Wrapper to cache response body
    private static class CachedResponseWrapper extends jakarta.servlet.http.HttpServletResponseWrapper {
        private final CachedServletOutputStream outputStream = new CachedServletOutputStream();

        public CachedResponseWrapper(HttpServletResponse response) {
            super(response);
        }

        @Override
        public ServletOutputStream getOutputStream() throws IOException {
            return outputStream;
        }

        @Override
        public PrintWriter getWriter() throws IOException {
            return new PrintWriter(outputStream);
        }

        public String getBody() {
            return outputStream.getBody();
        }

        public int getStatus() {
            return super.getStatus();
        }
    }

    // Helper classes for caching
    private static class CachedServletInputStream extends ServletInputStream {
        private final java.io.ByteArrayInputStream buffer;

        public CachedServletInputStream(byte[] contents) {
            this.buffer = new java.io.ByteArrayInputStream(contents);
        }

        @Override
        public int read() throws IOException {
            return buffer.read();
        }

        @Override
        public boolean isFinished() {
            return buffer.available() == 0;
        }

        @Override
        public boolean isReady() {
            return true;
        }

        @Override
        public void setReadListener(ReadListener readListener) {
            // Not implemented
        }
    }

    private static class CachedServletOutputStream extends ServletOutputStream {
        private final java.io.ByteArrayOutputStream buffer = new java.io.ByteArrayOutputStream();

        @Override
        public void write(int b) throws IOException {
            buffer.write(b);
        }

        public String getBody() {
            return buffer.toString(StandardCharsets.UTF_8);
        }

        @Override
        public boolean isReady() {
            return true;
        }

        @Override
        public void setWriteListener(WriteListener writeListener) {
            // Not implemented
        }
    }
}