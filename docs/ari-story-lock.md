# Ari Story Lock

This document is the message boundary for the website. Rewrite the site against this before changing scenes, layout, or CTA copy.

## Approved Sentence

Ari helps people who need to think clearly on a computer catch the moment focus starts to slip and overload starts to rise, then suggests simple steps to protect focus or take a break.

This is the one sentence every page, scene, and CTA should stay consistent with.

## Product Name

- Ari

## Primary Audience

- People whose work depends on thinking clearly on a computer
- The strongest fit in the current site direction is founders, operators, PMs, engineers, analysts, designers, and consultants

## Core Problem

- Their day gets scattered across tabs, meetings, docs, chat, switching, and interruption
- They usually notice the damage after focus is already gone

## Core Promise

- Ari gives the user an earlier signal that focus is slipping or overload is building
- Ari turns that signal into simple, understandable guidance instead of abstract scores alone

## What Ari Can Honestly Say

- Ari watches activity patterns from keyboard activity, mouse activity, app switching, and idle time
- Ari estimates focus, overload, trust, and calibration state
- Ari can suggest breaks, stretch breaks, focus protection, and notification suppression
- The user stays in control with pause, resume, export, delete-local-data, and consent controls

## What Ari Must Not Say

- Ari does not claim to read thoughts, emotions, or inner feelings directly
- Ari does not claim to read typed content, screenshots, or clipboard contents
- Ari does not claim EEG, heart rate, EDA, or other hardware sensing in the current product story
- Ari should not be framed as a research lab demo, neuro-adaptive platform, or experimental emotional intelligence system

## Language Rules

- Use plain English
- Lead with the user problem, not the system architecture
- Say "activity patterns" instead of dense telemetry language when speaking to first-time visitors
- Say "focus" and "overload" before "trust" and "calibration"
- Talk about suggestions and protection first; talk about internals second

## Words To Prefer

- focus
- overload
- activity patterns
- app switching
- idle time
- protect focus
- take a break
- stay in control
- pause
- export data
- delete local data
- revoke consent

## Words To Avoid

- neuro-adaptive
- emotional intelligence system
- immersive-first
- therapeutic environments
- experimental interfaces
- multimodal emotional inference
- physiological sensing
- EEG
- EDA
- hardware-agnostic architecture

## Source Boundaries In The Repo

These message boundaries come from the current Ari product behavior in the Windows app and agent runtime:

- `src/Porta.UserAgent/UserAgentHost/UserAgentHost.cs`
  - keyboard, mouse, app-switch, and idle-time activity are captured and summarized into local API input windows
- `src/Porta.ControlCenter/MainWindow.xaml`
  - the UI explicitly explains activity patterns from keyboard, mouse, app switches, and idle time
- `src/Porta.ControlCenter/MainWindow.xaml.cs`
  - the UI presents focus, overload, trust, calibration, pause, export, delete-local-data, and consent controls
- `src/Porta.Agent.Common/PortaActionSemantics.cs`
  - the current action surface includes break suggestions, stretch-break suggestions, focus protection, and deep-work notification suppression

## How To Use This In The Site

- Scene 0 should open with the user problem and the approved sentence
- Scene 1 should explain what Ari watches in plain English
- Scene 2 should explain what Ari figures out, starting with focus and overload
- Scene 3 should show who Ari is for, using common computer-work roles
- Scene 4 should emphasize control, privacy boundaries, and consent
- Scene 5 should ask for access to the Windows beta without research language

## Gate For Future Copy Changes

Before merging copy changes, check three things:

- A first-time visitor can understand the sentence in one pass
- Every claim can be pointed back to the current repo behavior
- Nothing sounds like a lab project
