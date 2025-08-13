package eu.zavadil.wn.config;

import eu.zavadil.java.oauth.client.OAuthClient;
import eu.zavadil.java.oauth.client.OAuthClientHttp;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

@Configuration
public class OAuthClientConfig {

	@Value("${spring.application.name}")
	String appName;

	@Value("${oauth.url}")
	String oauthUrl;

	@Bean
	OAuthClient oAuthClient() {
		return new OAuthClientHttp(this.oauthUrl);
	}

}
