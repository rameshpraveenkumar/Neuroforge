package com.neuroforge.service.ai;

public interface AiProvider {

    String generate(String type, String prompt);

    String getProviderName();

    boolean isAvailable();
}