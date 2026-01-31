package com.capstone.planbookai.controller;

import com.capstone.planbookai.model.PromptTemplate;
import com.capstone.planbookai.service.PromptTemplateService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/prompts")
@CrossOrigin(origins = "*")
public class PromptTemplateController {

    @Autowired
    private PromptTemplateService promptTemplateService;

    @GetMapping
    public List<PromptTemplate> getAllPrompts() {
        return promptTemplateService.getAllTemplates();
    }

    @PostMapping
    public ResponseEntity<PromptTemplate> createPrompt(@RequestBody PromptTemplate template) {
        return ResponseEntity.ok(promptTemplateService.saveTemplate(template));
    }

    @PutMapping("/{id}")
    public ResponseEntity<PromptTemplate> updatePrompt(@PathVariable Long id, @RequestBody PromptTemplate template) {
        template.setId(id); // Ensure ID is set
        return ResponseEntity.ok(promptTemplateService.saveTemplate(template));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deletePrompt(@PathVariable Long id) {
        promptTemplateService.deleteTemplate(id);
        return ResponseEntity.noContent().build();
    }
}