package com.starmind.service;

import com.starmind.model.User;
import com.starmind.model.Video;
import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.List;
import java.util.Optional;

@Service
public class StarmindService {

    private final User currentUser = new User("Maria", "🦄", 0, 0, 60);
    private final List<Video> videoCatalog = new ArrayList<>();

    public StarmindService(){

        videoCatalog.add(new Video(1L, "Tabuada Divertida do 5", "Matemática", 50, "12:30", "StarMind", "nK4_I6K8bAM", false));
        videoCatalog.add(new Video(2L, "Como as Plantas Crescem?", "Ciências", 60, "15:45", "YouTube Kids", "8I9S_wH_Xb8", false));
        videoCatalog.add(new Video(3L, "Histórias da Gramática", "Português", 40, "10:20", "StarMind", "Q-XN85G55Y4", false));
        videoCatalog.add(new Video(4L, "Aprenda Cores em Inglês", "Inglês", 35, "08:15", "Netflix", "Y9jF1w-4V5c", false));
        videoCatalog.add(new Video(5L, "Pintura Abstrata com Guache", "Arte", 45, "11:10", "YouTube Kids", "3B8Zf_X4V5d", false));
    }

    public User getUser() {
        return currentUser;
    }
    public User updateUserProfile(User userUpdadteData){
        currentUser.setName(userUpdadteData.getName());
        currentUser.setAvatar(userUpdadteData.getAvatar());
        return currentUser;
    }
    public User updateTimeLimit(int minutes){
        currentUser.setDailyTimeLimitMinutes(minutes);
        return currentUser;
    }
    public List<Video> getAllVideo(){
        return videoCatalog;
    }
    public void addVideo(Video video){
        video.setId(System.currentTimeMillis());
        video.setWatched(false);
        videoCatalog.add(video);
    }

    public Optional<Video> watchVideo(Long videoId){
        Optional<Video> videoOpt = videoCatalog.stream().filter(v -> v.getId().equals(videoId)).findFirst();

        if (videoOpt.isPresent() && !videoOpt.get().isWatched()){
            Video video = videoOpt.get();
            video.setWatched(true);

            currentUser.setPoints(currentUser.getPoints() + video.getPoints());
            currentUser.setWatchedCount(currentUser.getWatchedCount() + 1);
        }
        return videoOpt;
    }
}
