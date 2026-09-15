package com.neuroforge.config;

import org.springframework.boot.context.properties.ConfigurationProperties;
import org.springframework.context.annotation.Configuration;

@Configuration
@ConfigurationProperties(prefix = "neuroforge.ai")
public class AiProperties {

    private String provider = "offline";
    private boolean enabled = false;
    private String baseUrl = "";
    private String apiKey = "";
    private String model = "gpt-4o-mini";
    private int timeoutMs = 15000;

    public AiProperties() {}

    public String getProvider() {
        return provider;
    }

    public void setProvider(String provider) {
        this.provider = provider;
    }

    public boolean isEnabled() {
        return enabled;
    }

    public void setEnabled(boolean enabled) {
        this.enabled = enabled;
    }

    public String getBaseUrl() {
        return baseUrl;
    }

    public void setBaseUrl(String baseUrl) {
        this.baseUrl = baseUrl != null ? baseUrl.trim() : "";
    }

    public String getApiKey() {
        return apiKey;
    }

    public void setApiKey(String apiKey) {
        this.apiKey = apiKey != null ? apiKey.trim() : "";
    }

    public String getModel() {
        return model;
    }

    public void setModel(String model) {
        this.model = model != null && !model.isBlank() ? model.trim() : "gpt-4o-mini";
    }

    public int getTimeoutMs() {
        return timeoutMs > 0 ? timeoutMs : 15000;
    }

    public void setTimeoutMs(int timeoutMs) {
        this.timeoutMs = timeoutMs;
    }
}