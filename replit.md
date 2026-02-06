# Overview

This project is a multi-featured WhatsApp bot named "Phoenix" (also referred to as "yurie") built with Node.js and the Baileys WhatsApp library. The bot provides various functionalities including AI interactions, card collection games, Pokémon systems, economy features, and group management tools. It's designed to work across multiple WhatsApp instances and can be deployed on various platforms like Heroku, Railway, and Koyeb.

# User Preferences

Preferred communication style: Simple, everyday language.

# System Architecture

## Core Architecture
The bot uses a modular command-based architecture with separate handlers for different types of operations:

- **Message Handler**: Processes incoming WhatsApp messages and routes commands
- **Events Handler**: Manages group events like joins, leaves, promotions, and demotions
- **Card Handler**: Manages automated card spawning with cron scheduling
- **Pokémon Handler**: Handles wild Pokémon spawns and encounters

## Authentication & Session Management
- Uses Baileys' multi-file authentication state for WhatsApp Web sessions
- Stores authentication credentials in `auth_info/` directory
- Supports multiple bot instances through PM2 configuration

## Database Layer
The bot implements a multi-database approach:
- **MongoDB**: Primary database for economy and user data using Mongoose
- **QuickDB**: For caching and temporary data storage
- **Key-Value Stores**: Separate stores for cards, Pokémon, experience points, and active points

## Command System
Commands are organized into categories (Core, AI, Cards, Dev) with:
- Cooldown management to prevent spam
- Experience point rewards
- Role-based access control for developer commands
- Reaction-based feedback system

## Game Systems

### Card Collection Game
- Automated card spawning with captcha verification
- Tiered rarity system (1-6, S)
- Trading, selling, and auction mechanics
- Collection and deck management
- Background customization for card displays

### Pokémon System
- Wild Pokémon encounters with stats and movesets
- Party and storage system management
- Level progression and experience tracking
- Gender and rarity mechanics

### Economy System
- Coin-based economy with wallet and treasury
- Active point system for user engagement
- Leaderboards and ranking systems
- Integration with card prices and auction mechanics

## Media Processing
- Image analysis using OCR Space API
- AI image generation through Hercai
- GIF to MP4 conversion for animated content
- Image uploading via ImgBB service
- Collage creation for card displays

## Group Management
- Anti-link protection with automatic removal
- Event notifications for group activities
- Admin role verification and management
- Broadcasting capabilities for announcements

# External Dependencies

## Third-Party APIs
- **OCR Space**: Text extraction from images
- **Hercai AI**: GPT responses and image generation
- **PokéAPI**: Pokémon data and statistics
- **ImgBB**: Image hosting and URL generation
- **MyInstants**: Sound effect retrieval
- **Custom Card API**: Card data and random card generation

## Database Services
- **MongoDB Atlas**: User data, economy, and persistent storage
- **QuickDB with MongoDB Driver**: Caching and session management

## WhatsApp Integration
- **@whiskeysockets/baileys**: WhatsApp Web API for messaging
- **qrcode-terminal**: QR code generation for authentication
- **pino**: Logging framework for debugging

## Deployment & Process Management
- **PM2**: Process management for multiple bot instances
- **Express**: Web server for health checks and webhooks
- **node-cron**: Scheduled tasks for automated features

## Media & Utility Libraries
- **Sharp**: Image processing and manipulation
- **Cheerio**: HTML parsing for web scraping
- **Axios**: HTTP client for API requests
- **better-sqlite3**: Local database for quick access
- **Form-data**: File uploads and form submissions