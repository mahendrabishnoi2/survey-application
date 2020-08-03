package com.mahendra.survey.config;

import java.util.ArrayList;
import java.util.List;
import java.util.Set;
import javax.persistence.EntityManager;
import javax.persistence.metamodel.EntityType;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.context.annotation.Configuration;
import org.springframework.data.rest.core.config.RepositoryRestConfiguration;
import org.springframework.data.rest.webmvc.config.RepositoryRestConfigurer;

@Configuration
public class MyDataRestConfig implements RepositoryRestConfigurer {

  @Autowired
  private EntityManager entityManager;

  @Override
  public void configureRepositoryRestConfiguration(RepositoryRestConfiguration config) {

    // call an internal helper method to expose ids
    exposeIds(config);
  }

  private void exposeIds(RepositoryRestConfiguration config) {
    // expose entity ids

    // get a collection of all entity classes from entityManager
    Set<EntityType<?>> entities = entityManager.getMetamodel().getEntities();

    // create an array of entity types
    List<Class> entityClasses = new ArrayList<>();

    // get the entity types for the entities
    for (EntityType entityType: entities) {
      entityClasses.add(entityType.getJavaType());
    }

    // expose the entity ids for the array of entity/domain types
    Class[] domainTypes = entityClasses.toArray(new Class[0]);
    config.exposeIdsFor(domainTypes);

    /*
    https://stackoverflow.com/questions/30912826/expose-all-ids-when-using-spring-data-rest/33171702#33171702
    config.exposeIdsFor(entityManager.getMetamodel().getEntities().stream().map(e -> e.getJavaType()).collect(Collectors.toList()).toArray(new Class[0]));
     */
  }
}
