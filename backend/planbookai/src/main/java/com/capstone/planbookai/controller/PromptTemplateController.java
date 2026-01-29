package com.capstone.planbookai.controller;

import com.capstone.planbookai.model.PromptTemplate;
import com.capstone.planbookai.service.PromptTemplateService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@CrossOrigin(origins = "*", maxAge = 3600)
@RestController
@RequestMapping("/api/prompts")
public class PromptTemplateController {

    @Autowired
    private PromptTemplateService promptTemplateService;

    @GetMapping
    public ResponseEntity<List<PromptTemplate>> getAllPrompts() {
        return ResponseEntity.ok(promptTemplateService.getAllTemplates());
    }

    @GetMapping("/{name}")
    public ResponseEntity<?> getPromptByName(@PathVariable String name) {
        return promptTemplateService.getTemplateByName(name)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    @PostMapping
    public ResponseEntity<PromptTemplate> createPrompt(@RequestBody PromptTemplate promptTemplate) {
        return ResponseEntity.ok(promptTemplateService.saveTemplate(promptTemplate));
    }

    @PutMapping("/{id}")
    public ResponseEntity<?> updatePrompt(@PathVariable Long id, @RequestBody PromptTemplate promptTemplate) {
        promptTemplate.setId(id);
        return ResponseEntity.ok(promptTemplateService.saveTemplate(promptTemplate));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<?> deletePrompt(@PathVariable Long id) {
        promptTemplateService.deleteTemplate(id);
        return ResponseEntity.ok().build();
    }
}
