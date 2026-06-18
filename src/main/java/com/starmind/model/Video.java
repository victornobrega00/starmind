package com.starmind.model;

public class Video {
    private Long id;
    private String title;
    private String subject;
    private int points;
    private String time;
    private String plataform;
    private String ytId;
    private boolean watched;

    public Video() {
    }

    public Video(Long id, String title, String subject, int points, String time, String plataform, String ytId, boolean watched) {
        this.id = id;
        this.title = title;
        this.subject = subject;
        this.points = points;
        this.time = time;
        this.plataform = plataform;
        this.ytId = ytId;
        this.watched = watched;
    }

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public String getTitle() {
        return title;
    }

    public void setTitle(String title) {
        this.title = title;
    }

    public String getSubject() {
        return subject;
    }

    public void setSubject(String subject) {
        this.subject = subject;
    }

    public int getPoints() {
        return points;
    }

    public void setPoints(int points) {
        this.points = points;
    }

    public String getTime() {
        return time;
    }

    public void setTime(String time) {
        this.time = time;
    }

    public String getPlataform() {
        return plataform;
    }

    public void setPlataform(String plataform) {
        this.plataform = plataform;
    }

    public String getYtId() {
        return ytId;
    }

    public void setYtId(String ytId) {
        this.ytId = ytId;
    }

    public boolean isWatched() {
        return watched;
    }

    public void setWatched(boolean watched) {
        this.watched = watched;
    }
}
