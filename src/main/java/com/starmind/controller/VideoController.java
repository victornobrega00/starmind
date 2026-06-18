package com.starmind.controller;

import com.starmind.model.Video;
import com.starmind.service.StarmindService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/videos")
@CrossOrigin(origins = "*")
public class VideoController {

    private final StarmindService service;

    public VideoController(StarmindService service) {
        this.service = service;
    }
    @GetMapping
    public List<Video> getAllVideos(){
        return service.getAllVideo();
    }
    @PostMapping
    public ResponseEntity<String> addVideo(@RequestBody Video video){
        service.addVideo(video);
        return ResponseEntity.ok("Vídeo adicionado com sucesso em conformidade com o ECA Digital!");
    }
    @PostMapping("/{id}/watch")
    public ResponseEntity<Video> watchVideo(@PathVariable Long id) {
        return service.watchVideo(id)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }
}
