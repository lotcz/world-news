package eu.zavadil.wn.config;

import com.pgvector.PGvector;
import org.springframework.boot.autoconfigure.domain.EntityScan;
import org.springframework.boot.context.properties.ConfigurationProperties;
import org.springframework.boot.jdbc.DataSourceBuilder;
import org.springframework.boot.orm.jpa.hibernate.SpringImplicitNamingStrategy;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.context.annotation.Primary;
import org.springframework.data.jpa.repository.config.EnableJpaRepositories;
import org.springframework.orm.jpa.JpaTransactionManager;
import org.springframework.orm.jpa.LocalContainerEntityManagerFactoryBean;
import org.springframework.orm.jpa.vendor.HibernateJpaVendorAdapter;
import org.springframework.transaction.PlatformTransactionManager;

import javax.sql.DataSource;
import java.sql.Connection;
import java.sql.SQLException;
import java.util.HashMap;

@Configuration
@EntityScan(basePackages = "eu.zavadil.wn.data")
@EnableJpaRepositories(
	basePackages = "eu.zavadil.wn.data",
	entityManagerFactoryRef = "mainEntityManagerFactory",
	transactionManagerRef = "mainTransactionManager"
)
public class DataConfig {

	@Primary
	@Bean(name = "mainDataSource")
	@ConfigurationProperties(prefix = "spring.datasource")
	public DataSource mainDataSource() {
		return DataSourceBuilder.create().build();
	}

	@Primary
	@Bean(name = "mainEntityManagerFactory")
	public LocalContainerEntityManagerFactoryBean entityManagerFactory() {
		LocalContainerEntityManagerFactoryBean em = new LocalContainerEntityManagerFactoryBean();
		em.setDataSource(this.mainDataSource());

		HibernateJpaVendorAdapter vendorAdapter = new HibernateJpaVendorAdapter();
		vendorAdapter.setGenerateDdl(false);
		vendorAdapter.setShowSql(false);
		em.setJpaVendorAdapter(vendorAdapter);

		HashMap<String, Object> properties = new HashMap<>();
		properties.put("hibernate.physical_naming_strategy", "org.hibernate.boot.model.naming.CamelCaseToUnderscoresNamingStrategy");
		properties.put("hibernate.implicit_naming_strategy", SpringImplicitNamingStrategy.class.getName());
		em.setJpaPropertyMap(properties);

		em.setPackagesToScan("eu.zavadil.wn.data");
		em.setPersistenceUnitName("wn");

		return em;
	}

	@Primary
	@Bean(name = "mainTransactionManager")
	public PlatformTransactionManager mainTransactionManager() {
		JpaTransactionManager transactionManager = new JpaTransactionManager();
		transactionManager.setEntityManagerFactory(this.entityManagerFactory().getObject());
		return transactionManager;
	}

	/* code below is for PGVector registration */

	@Bean
	public DataSourceInitializer pgvectorInitializer(DataSource dataSource) {
		return new DataSourceInitializer(dataSource);
	}

	static class DataSourceInitializer {
		public DataSourceInitializer(DataSource dataSource) {
			try (Connection conn = dataSource.getConnection()) {
				PGvector.addVectorType(conn);
			} catch (SQLException e) {
				throw new RuntimeException("Failed to register pgvector type", e);
			}
		}
	}
}
