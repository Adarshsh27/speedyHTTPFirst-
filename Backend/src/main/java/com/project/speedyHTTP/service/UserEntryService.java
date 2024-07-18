package com.project.speedyHTTP.service;
import com.project.speedyHTTP.model.NewURLEntry;
import com.project.speedyHTTP.model.Pair;
import com.project.speedyHTTP.model.RemoveURLEntry;
import com.project.speedyHTTP.model.UserEntry;
import com.project.speedyHTTP.repository.EntryRepository;
import com.project.speedyHTTP.repository.URLParser;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.mongodb.core.MongoTemplate;
import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.List;
import java.util.Optional;
import org.springframework.data.mongodb.core.query.Criteria;
import org.springframework.data.mongodb.core.query.Query;
import org.springframework.data.mongodb.core.query.Update;
import com.project.speedyHTTP.processing.HashUtility;

@Service
public class UserEntryService {
    @Autowired
    private EntryRepository entryRepository;
    @Autowired
    private MongoTemplate mongoTemplate;
    @Autowired
    private URLParser urlParser;


    /**
     * This function is called whenever user bookmarks a new network call to track and we populate all the different fields in the user Data base
     * hosted in mongo
     * @param newURLEntry
     * @return
     */
    public Optional<UserEntry> updateUserAdd(NewURLEntry newURLEntry){

        // get query string in the format of /a/b/c/d and in sorted manner
        String queryKeys = urlParser.getQueryKeys(newURLEntry.getUrl());
        // simple url of the form *://domain/path*
        String simpleURL = urlParser.getSimpleURL(newURLEntry.getUrl());
        // hashed simple url
        String simpleURLHashed = urlParser.getSimpleURLHashed(newURLEntry.getUrl());
        //  userUrl of the form *://domain/path*/query
        String userUrl = urlParser.userUrl(newURLEntry.getUrl());
        // generating a query
        Query query = new Query(Criteria.where("uid").is(newURLEntry.getUid()));

        // now we have simple url which can be used directly to add listeners on the chrome extension
        Update update = new Update().push("bookmarks" , simpleURL );
        mongoTemplate.updateFirst(query , update , UserEntry.class);

        // adding user url
        update = new Update().addToSet("userProvidedUrl" , userUrl);
        mongoTemplate.updateFirst(query , update , UserEntry.class);

        // update validation

        // update uipayload filter

        // add methods to track for this url
        for(String method : newURLEntry.getMethods()){
            // complex url => *://domain/path*/queryKeys/method
            String complexUrl = simpleURL + queryKeys + "/" + method;
            // hashed
            complexUrl = HashUtility.sha256(complexUrl);
            update = new Update().push("methodsToTrack." + simpleURLHashed, method);
            mongoTemplate.updateFirst(query , update , UserEntry.class);

            // adding methods to track for user
            update = new Update().addToSet("methodsToTrackForUser." + HashUtility.sha256(userUrl) , method );
            mongoTemplate.updateFirst(query , update , UserEntry.class);

            // update queryParams for simple URL + method hashed ;

            String simpleURLMethodHashed = HashUtility.sha256(simpleURL + "/" +  method);
            // we have update the query param string
            update = new Update().addToSet("queryParams." + simpleURLMethodHashed , queryKeys);
            mongoTemplate.updateFirst(query , update , UserEntry.class);

            // we need to make the map as well for query
            if(newURLEntry.getQueryParams().get(method) != null && !newURLEntry.getQueryParams().get(method).isEmpty()){
                // so now we have the list of  key value pair
                for(Pair i : newURLEntry.getQueryParams().get(method)){
                    update = new Update().addToSet("queriesToTrack." + HashUtility.sha256(simpleURL + queryKeys + "/" + method) + "." + i.getField(), i.getValue());
                    mongoTemplate.updateFirst(query , update , UserEntry.class);
                }

                // now we have updated our key value pairs
            }

            if(method.equals("POST")){
                List<String> payloadFilter = new ArrayList<>();

                for(Pair i : newURLEntry.getPostPayloadFilters()){
                    // lets update our payloads now
                    update = new Update().addToSet("uiPayloadFilter." + simpleURLHashed + "." + method, i.getField());
                    mongoTemplate.updateFirst(query , update , UserEntry.class);
                    update = new Update().addToSet("payloadFilter." + complexUrl , i.getField());
                    mongoTemplate.updateFirst(query , update , UserEntry.class);
                    update = new Update().addToSet("payloadFilterForUser." + HashUtility.sha256(userUrl) + "." + method , i.getField() );
                    mongoTemplate.updateFirst(query , update , UserEntry.class);
                    update = new Update().addToSet("payloadToTrack." + complexUrl + "." + i.getField() , i.getValue());
                    mongoTemplate.updateFirst(query , update , UserEntry.class);
                }

            }
            else if(method.equals("PUT")){
                List<String> payloadFilter = new ArrayList<>();
                for(Pair i : newURLEntry.getPutPayloadFilters()){
                    // updating payload for put calls
                    update = new Update().addToSet("uiPayloadFilter." + simpleURLHashed + "." + method, i.getField());
                    mongoTemplate.updateFirst(query , update , UserEntry.class);
                    update = new Update().addToSet("payloadFilter." + complexUrl , i.getField());
                    mongoTemplate.updateFirst(query , update , UserEntry.class);
                    update = new Update().addToSet("payloadFilterForUser." + HashUtility.sha256(userUrl) + "." + method , i.getField() );
                    mongoTemplate.updateFirst(query , update , UserEntry.class);
                    update = new Update().addToSet("payloadToTrack." + complexUrl + "." + i.getField() , i.getValue());
                    mongoTemplate.updateFirst(query , update , UserEntry.class);
                }
            }
        }
        return getUser(newURLEntry.getUid());
    }

    /**
     * if user removes a url call entirely, then we call this function and make the changes
     * @param removeURLEntry
     * @return
     */
    public Boolean updateUserRemoveUrl(RemoveURLEntry removeURLEntry){
        Query query = new Query(Criteria.where("uid").is(removeURLEntry.getUid()));

        // user url if of the form => *://domain/path*/query/method
        String userUrl = removeURLEntry.getUserUrl();
        String userUrlHashed = HashUtility.sha256(userUrl);
        String simpleUrl = urlParser.getSimpleUrlFromUserUrl(userUrl);
        // simpleUrl is of the form => *://domain/path*
        String simpleUrlHashed = HashUtility.sha256(simpleUrl);

        // we remove user url
        Update update = new Update().pull("userProvidedUrl" , userUrl);
        mongoTemplate.updateFirst(query , update , UserEntry.class);
        // we remove methods to track for user
        update = new Update().unset("methodsToTrackForUser."+userUrlHashed );
        mongoTemplate.updateFirst(query , update , UserEntry.class);

        // we remove payload to track for user
        update = new Update().unset("payloadFilterForUser." + userUrlHashed );
        mongoTemplate.updateFirst(query , update , UserEntry.class);

        // we remove simple url
        update = new Update().pull("bookmarks" , simpleUrl);
        mongoTemplate.updateFirst(query , update , UserEntry.class);

        // we remove from ui payload filter
        update = new Update().unset("uiPayloadFilter." + simpleUrlHashed );
        mongoTemplate.updateFirst(query , update , UserEntry.class);


        for(String method : removeURLEntry.getMethod()){

            // user url => *://domain/path*/queries
            String complexUrl = userUrl + "/" + method;
            String complexUrlHashed = HashUtility.sha256(complexUrl);
            // we remove from payload filter
            update = new Update().unset("payloadFilter." + complexUrlHashed  );
            mongoTemplate.updateFirst(query , update , UserEntry.class);

            // unsetting the payloadToTrack
            update = new Update().unset("payloadToTrack." + complexUrlHashed  );
            mongoTemplate.updateFirst(query , update , UserEntry.class);

            // we remove from query Params
            String key = HashUtility.sha256(simpleUrl + "/"+  method);
            update = new Update().unset("queryParams." + key  );
            mongoTemplate.updateFirst(query , update , UserEntry.class);

            // unsetting queries to track it has the complex url as key .. *://domain/path*/query/method
            update = new Update().unset("queriesToTrack." + complexUrlHashed);
            mongoTemplate.updateFirst(query , update , UserEntry.class);

            // lets unset the payload as well


            // we remove methods to track
            update = new Update().pull("methodsToTrack." + simpleUrlHashed ,  method);
            mongoTemplate.updateFirst(query , update , UserEntry.class);
        }

        return true;
    }

    /**
     * this function is called when user only removes a particular method
     * @param removeURLEntry
     * @return
     */
    public Boolean updateUserRemoveMethod(RemoveURLEntry removeURLEntry){
        Query query = new Query(Criteria.where("uid").is(removeURLEntry.getUid()));
        String userUrl = removeURLEntry.getUserUrl();
        String userUrlHashed = HashUtility.sha256(userUrl);
        String simpleUrl = urlParser.getSimpleUrlFromUserUrl(userUrl);
        String method = removeURLEntry.getMethod().get(0);
        String simpleUrlHashed = HashUtility.sha256(simpleUrl);
        Update update = new Update();

        // we remove methods to track for user
        update = new Update().pull("methodsToTrackForUser."+userUrlHashed , method);
        mongoTemplate.updateFirst(query , update , UserEntry.class);

        // we remove payload to track for user
        update = new Update().unset("payloadFilterForUser." + userUrlHashed +"." + method );
        mongoTemplate.updateFirst(query , update , UserEntry.class);





            // we remove from ui payload filter
            update = new Update().unset("uiPayloadFilter." + simpleUrlHashed + "." + method );
            mongoTemplate.updateFirst(query , update , UserEntry.class);


            String complexUrl = userUrl + "/" +  method;
            String complexUrlHashed = HashUtility.sha256(complexUrl);

            // we remove from payload filter
            update = new Update().unset("payloadFilter." + complexUrlHashed );
            mongoTemplate.updateFirst(query , update , UserEntry.class);

            // we remove the payloadToTrack
            update = new Update().unset("payloadToTrack." + complexUrlHashed );
            mongoTemplate.updateFirst(query , update , UserEntry.class);

            // if we need to remove queries to track... lets just use complex url for that and for that we need query keys ..
            // so lets iterate over all of them
            String simpleUrlWithMethod = HashUtility.sha256(simpleUrl + "/"+  method);

            UserEntry user = getUser(removeURLEntry.getUid()).get();
            if(user.getQueryParams().get(simpleUrlWithMethod)!=null && user.getQueryParams().get(simpleUrlWithMethod).size() > 0 ){
                for(String queryKeys : user.getQueryParams().get(simpleUrlWithMethod)){
                    String tempComplexUrl = HashUtility.sha256(userUrl + "/" + method);
                    // if for a specific call we are unsetting the method... then all the corresponding queries also get unset
                    update = new Update().unset("queriesToTrack." + tempComplexUrl);
                    mongoTemplate.updateFirst(query , update , UserEntry.class);
                }
            }
            // we remove from query Params
            update = new Update().unset("queryParams." + simpleUrlWithMethod);
            mongoTemplate.updateFirst(query , update , UserEntry.class);

            // we remove methods to track
            update = new Update().pull("methodsToTrack." + simpleUrlHashed ,  method);
            mongoTemplate.updateFirst(query , update , UserEntry.class);

        return true;
    }

    /**
     * this function is called when user decides to remove only a payload filter
     * @param removeURLEntry
     * @return
     */
    public Boolean updateUserRemovePayload(RemoveURLEntry removeURLEntry){
        Query query = new Query(Criteria.where("uid").is(removeURLEntry.getUid()));
        String userUrl = removeURLEntry.getUserUrl();
        String userUrlHashed = HashUtility.sha256(userUrl);
        String simpleUrl = urlParser.getSimpleUrlFromUserUrl(userUrl);
        String method = removeURLEntry.getMethod().get(0);
        String payload = removeURLEntry.getPayload().get(0);
        String simpleUrlHashed = HashUtility.sha256(simpleUrl);
        String complexUrl = userUrl + "/"+ method;
        String complexUrlHashed = HashUtility.sha256(complexUrl);
        Update update = new Update();


        // we remove payload to track for user
        update = new Update().pull("payloadFilterForUser." + userUrlHashed + "." + method , payload);
        mongoTemplate.updateFirst(query , update , UserEntry.class);


        // we need to remove payload to track
        update = new Update().unset("payloadToTrack." +  complexUrlHashed + "." + payload);
        mongoTemplate.updateFirst(query, update , UserEntry.class);



        // we remove from ui payload filter
        update = new Update().pull("uiPayloadFilter." + simpleUrlHashed + "." + method , payload );
        mongoTemplate.updateFirst(query , update , UserEntry.class);



        // we remove from payload filter
        update = new Update().pull("payloadFilter." + complexUrlHashed , payload );
        mongoTemplate.updateFirst(query , update , UserEntry.class);




        return true;
    }


    public boolean deleteAll(){
        entryRepository.deleteAll();
        return  true;
    }

    public UserEntry addUserEntry(UserEntry user){
        return entryRepository.save(user);
    }
    public List<UserEntry> findAllEntries(){
        return entryRepository.findAll();
    }
    public Optional<UserEntry> getUser(String ID){
        return entryRepository.findById(ID);
    }

    public boolean deleteUserEntry(String ID){
        entryRepository.deleteById(ID);
        return true;
    }

}
