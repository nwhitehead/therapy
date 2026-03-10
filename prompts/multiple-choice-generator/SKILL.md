---
name: multiple-choice-generator
description: Generate multiple choice quiz questions from educational content. Use this skill whenever a user wants to create quiz questions, test questions, or assessment items from provided text, documents, or educational materials. Applies to academic, technical, business, or any educational content where the user needs to extract key concepts and create assessment items.
---

# Multiple Choice Question Generator

This skill helps you generate high-quality multiple choice questions from educational content.

## When to Use This Skill

Use this skill when the user:
- Provides educational text, articles, or documents and wants quiz questions
- Asks to create test questions from study materials
- Needs assessment items generated from content
- Wants to create practice questions from documents
- Asks for MCQ generation from any source material

## Input Requirements

The user should provide:
1. **Educational content** - text, markdown, PDF, or other document formats
2. **Number of questions** (optional) - how many questions to generate
3. **Topic focus** (optional) - specific areas to emphasize

## Output Format

Always output questions in this JSON structure:

```json
{
  "questions": [
    {
      "question": "What is the primary mechanism by which [concept] operates?",
      "options": [
        {"text": "Correct answer", "correct": true},
        {"text": "Distractor 1", "correct": false},
        {"text": "Distractor 2", "correct": false},
        {"text": "Distractor 3", "correct": false}
      ],
      "explanation": "Brief explanation of why the correct answer is right"
    }
  ]
}
```

Each question:
- Has the question text in **markdown** format
- Contains either exactly 4 options (1 correct, 3 distractors) or is a yes/no true/false kind of question and contains exactly 2 options (1 correct, 1 distractor)
- Includes an explanation for the correct answer
- Tests comprehension, not just recall

## Question Generation Guidelines

### Quality Principles

1. **Test understanding, not memorization**
   - Good: "How does X affect Y in scenario Z?"
   - Bad: "What is the definition of X?"

2. **Make distractors plausible**
   - Common misconceptions
   - Partially correct answers
   - Answers that seem right without careful reading

3. **Keep questions focused**
   - One clear topic per question
   - Avoid compound questions

4. **Use clear, unambiguous language**
   - Avoid trick questions
   - Make sure only one answer is clearly correct

5. **Independent answers**
   - Answer choices must not refer to other choices

### Structure Best Practices

- Questions should be 1-2 sentences
- Options should be roughly equal length
- Avoid "all of the above" or "none of the above"
- Don't use negatives (or highlight them with ALL CAPS and *BOLD*)

## Process

1. **Read and understand the content**
   - Identify key concepts
   - Note important relationships
   - Find specific examples or data

2. **Select concepts to assess**
   - Choose 3-5 main ideas per section
   - Prioritize concepts that require understanding

3. **Draft questions**
   - Start with the concept
   - Frame as a question about the concept
   - Create one correct answer
   - Write three plausible distractors

4. **Review and refine**
   - Verify only one answer is correct
   - Check explanations are accurate
   - Ensure questions match the content

## Example

**Input Content (excerpt):**
> Photosynthesis is the process by which plants convert light energy into chemical energy. The primary pigment involved is chlorophyll, which absorbs red and blue wavelengths most efficiently. This process occurs in the chloroplasts, specifically in the thylakoid membranes.

**Generated Output:**
```json
{
  "questions": [
    {
      "question": "Which pigment is primarily responsible for absorbing light energy in photosynthesis?",
      "options": [
        {"text": "Chlorophyll", "correct": true},
        {"text": "Carotene", "correct": false},
        {"text": "Xanthophyll", "correct": false},
        {"text": "Melanin", "correct": false}
      ],
      "explanation": "Chlorophyll is the primary photosynthetic pigment, absorbing red and blue wavelengths most efficiently."
    },
    {
      "question": "Where does the light-dependent portion of photosynthesis primarily occur?",
      "options": [
        {"text": "Thylakoid membranes", "correct": true},
        {"text": "Stroma", "correct": false},
        {"text": "Outer membrane", "correct": false},
        {"text": "Cell wall", "correct": false}
      ],
      "explanation": "The thylakoid membranes contain the chlorophyll and electron transport chains needed for the light-dependent reactions."
    }
  ]
}
```

## Output Delivery

When complete:
1. Present the JSON in a code block
2. Briefly summarize what was covered
3. Offer to adjust difficulty, quantity, or focus areas
