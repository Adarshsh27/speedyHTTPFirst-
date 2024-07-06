//package com.adarsh.speedyHTTP.config;
//
//import co.elastic.clients.elasticsearch.ElasticsearchClient;
//
//import co.elastic.clients.json.jackson.JacksonJsonpMapper;
//
//import co.elastic.clients.transport.ElasticsearchTransport;
//
//import co.elastic.clients.transport.rest_client.RestClientTransport;
//
//import org.apache.http.HttpHost;
//
//import org.apache.http.HttpResponseInterceptor;
//import org.elasticsearch.client.RestClient;
//
//import org.elasticsearch.client.RestClientBuilder;
//import org.springframework.context.annotation.Bean;
//
//import org.springframework.context.annotation.ComponentScan;
//import org.springframework.context.annotation.Configuration;
//import org.springframework.data.elasticsearch.client.elc.ElasticsearchClients;
//import org.springframework.data.elasticsearch.client.elc.ElasticsearchTemplate;
//import org.springframework.data.elasticsearch.core.ElasticsearchOperations;
//import org.springframework.data.elasticsearch.repository.config.EnableElasticsearchRepositories;
//
////@Configuration
////
////public class ElasticSearchConfiguration {
////
////    @Bean
////
////    public RestClient getRestClient() {
////        return RestClient.builder(new HttpHost("localhost", 9200)).build();
////    }
////
////    @Bean
////    public ElasticsearchTransport getElasticsearchTransport() {
////        return new RestClientTransport(getRestClient(), new JacksonJsonpMapper());
////    }
////
////    @Bean
////    public ElasticsearchClient getElasticsearchClient(){
////        return new ElasticsearchClient(getElasticsearchTransport());
////    }
////
////}
//@Configuration
//@EnableElasticsearchRepositories(basePackages = "com.adarsh.speedyHTTP")
//@ComponentScan(basePackages = "com.adarsh.speedyHTTP")
//public class ElasticSearchConfig {
//
//    @Bean
//    public RestClient elasticsearchRestClient() {
//        return RestClient.builder(HttpHost.create("localhost:9200"))
//                .setHttpClientConfigCallback(httpClientBuilder -> {
//                    httpClientBuilder.addInterceptorLast((HttpResponseInterceptor) (response, context) ->
//                            response.addHeader("X-Elastic-Product", "Elasticsearch"));
//                    return httpClientBuilder;
//                })
//                .build();
//    }
//
//    @Bean
//    public ElasticsearchClient elasticsearchClient(RestClient restClient) {
//        return ElasticsearchClients.createImperative(restClient);
//    }
//
//    @Bean(name = { "elasticsearchOperations", "elasticsearchTemplate" })
//    public ElasticsearchOperations elasticsearchOperations(
//            ElasticsearchClient elasticsearchClient) {
//        ElasticsearchTemplate template = new ElasticsearchTemplate(elasticsearchClient);
//        template.setRefreshPolicy(null);
//        return template;
//    }
//}

package com.project.speedyHTTP.config;

import co.elastic.clients.elasticsearch.ElasticsearchClient;
import co.elastic.clients.json.jackson.JacksonJsonpMapper;
import co.elastic.clients.transport.ElasticsearchTransport;
import co.elastic.clients.transport.rest_client.RestClientTransport;
import org.apache.http.HttpHost;
import org.elasticsearch.client.RestClient;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;


@Configuration
public class ElasticsearchConfig {

    @Bean
    public ElasticsearchClient elasticsearchClient() {
        String serverUrl = "http://localhost:9200";
        RestClient restClient = RestClient.builder(HttpHost.create(serverUrl)).build();
        ElasticsearchTransport transport = new RestClientTransport(restClient, new JacksonJsonpMapper());
        return new ElasticsearchClient(transport);
    }

}
