package com.capstone.planbookai.service;

import com.capstone.planbookai.model.PromptTemplate;
import com.capstone.planbookai.repository.PromptTemplateRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
public class PromptTemplateService {

    @Autowired
    private PromptTemplateRepository promptTemplateRepository;

    public List<PromptTemplate> getAllTemplates() {
        return promptTemplateRepository.findAll();
    }

    public Optional<PromptTemplate> getTemplateByName(String name) {
        return promptTemplateRepository.findByName(name);
    }

    public PromptTemplate saveTemplate(PromptTemplate template) {
        return promptTemplateRepository.save(template);
    }

    public void deleteTemplate(Long id) {
        promptTemplateRepository.deleteById(id);
    }
}
