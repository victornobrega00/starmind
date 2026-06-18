package com.starmind.model;

public class User {
    private String name;
    private String avatar;
    private int points;
    private int watchedCount;
    private int dailyTimeLimitMinutes;

    public User() {
    }

    public User(String name, String avatar, int points, int watchedCount, int dailyTimeLimitMinutes) {
        this.name = name;
        this.avatar = avatar;
        this.points = points;
        this.watchedCount = watchedCount;
        this.dailyTimeLimitMinutes = dailyTimeLimitMinutes;
    }

    public String getName() {
        return name;
    }
    public void setName(String name) {
        this.name = name;
    }
    public String getAvatar() {
        return avatar;
    }
    public void setAvatar(String avatar) {
        this.avatar = avatar;
    }
    public int getPoints() {
        return points;
    }
    public void setPoints(int points) {
        this.points = points;
    }
    public int getWatchedCount() {
        return watchedCount;
    }
    public void setWatchedCount(int watchedCount) {
        this.watchedCount = watchedCount;
    }
    public int getDailyTimeLimitMinutes() {
        return dailyTimeLimitMinutes;
    }
    public void setDailyTimeLimitMinutes(int dailyTimeLimitMinutes) {
        this.dailyTimeLimitMinutes = dailyTimeLimitMinutes;
    }
}
