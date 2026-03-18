# Blueprint: Personal Stylist Service

## Overview
A personalized fashion styling service that provides outfit recommendations based on user physical attributes and preferences.

## Project Outline
- **Initial Version:** Keyword Radar (Base project).
- **Target Version:** Personal Stylist Service.
- **Core Features:**
    - User Profile: Photo upload, height, weight, and body type analysis.
    - Style Analysis: AI-driven suggestions based on physical data.
    - Virtual Try-on: (Future feature).

## Current Implementation Plan: Onboarding Screen
The goal is to create a beautiful, modern onboarding screen for users to enter their basic physical data.

### 1. UI/UX Design
- **Theme:** Minimalist, premium, and clean. Soft backgrounds with subtle textures.
- **Components:**
    - **Photo Upload:** Interactive drop-zone or click-to-upload area with instant preview (Labeled "사진").
    - **Physical Data:** Elegant numeric inputs for height (cm) and weight (kg) on the same screen.
    - **Transitions:** Smooth fade-ins using `framer-motion`.
- **Typography:** Expressive and readable.
- **Color Palette:** Warm neutrals, soft shadows, and a "glow" effect on primary buttons.

### 2. Implementation Steps
- [x] Initialize `blueprint.md`.
- [x] Update `App.css` with new styling variables and layout classes.
- [x] Refactor `App.tsx` to include:
    - State for `photo`, `height`, and `weight`.
    - `ImageUpload` component logic.
    - Single-page responsive form layout.
    - Validation and "Analysis" transition.
- [x] Verify responsiveness and visual fidelity.

### 3. Verification & Testing
- [x] Ensure image preview works correctly.
- [x] Validate height/weight inputs (range checks).
- [x] Check mobile responsiveness.
- [x] Linting and code quality checks.
