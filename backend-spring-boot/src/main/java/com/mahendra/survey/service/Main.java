package com.mahendra.survey.service;

import java.util.Calendar;
import java.util.Date;
import org.apache.commons.lang3.time.DateUtils;

public class Main {


  public static void main(String[] args) {
    Date todayMidnight = DateUtils.truncate(new Date(), Calendar.DAY_OF_MONTH);
    Date tomorrowMidnight = DateUtils.addDays(todayMidnight, 1);

    System.out.println(todayMidnight);
    System.out.println(tomorrowMidnight);
  }

}
