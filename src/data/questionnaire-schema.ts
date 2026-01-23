export type QuestionType = 'text' | 'textarea' | 'select' | 'multiselect' | 'toggle' | 'number';

export interface Question {
  id: string;
  label: string;
  description?: string;
  type: QuestionType;
  required?: boolean;
  options?: { value: string; label: string }[];
  placeholder?: string;
  visibleIf?: VisibilityCondition;
  followUps?: string[];
  tooltip?: string;
  riskLevel?: 'low' | 'medium' | 'high';
  featureMapping?: string[];
}

export interface VisibilityCondition {
  questionId: string;
  operator: 'equals' | 'includes' | 'notEquals' | 'hasValue';
  value?: string | string[] | boolean;
}

export interface Step {
  id: string;
  title: string;
  description: string;
  icon: string;
  questions: Question[];
  visibleIf?: VisibilityCondition;
}

export const questionnaireSchema: Step[] = [
  {
    id: 'framing',
    title: 'Project Framing',
    description: 'Define the core purpose and vision of your application',
    icon: '🎯',
    questions: [
      {
        id: 'app_name',
        label: 'What is the name of your app?',
        type: 'text',
        required: true,
        placeholder: 'e.g., TaskFlow, ShopEasy, ConnectHub'
      },
      {
        id: 'one_sentence',
        label: 'Describe your app in one sentence',
        description: 'This should capture the core value proposition',
        type: 'textarea',
        required: true,
        placeholder: 'e.g., A mobile-first marketplace connecting local artisans with conscious consumers'
      },
      {
        id: 'problem_solving',
        label: 'What problem does this solve?',
        type: 'textarea',
        required: true,
        placeholder: 'Describe the pain point your users currently experience'
      },
      {
        id: 'target_audience',
        label: 'Who is your primary target audience?',
        type: 'text',
        required: true,
        placeholder: 'e.g., Small business owners aged 25-45'
      },
      {
        id: 'success_metrics',
        label: 'How will you measure success?',
        type: 'multiselect',
        options: [
          { value: 'dau_mau', label: 'Daily/Monthly Active Users' },
          { value: 'retention', label: 'User Retention Rate' },
          { value: 'conversion', label: 'Conversion Rate' },
          { value: 'revenue', label: 'Revenue/GMV' },
          { value: 'nps', label: 'NPS Score' },
          { value: 'engagement', label: 'Engagement Time' },
          { value: 'custom', label: 'Custom Metrics' }
        ]
      }
    ]
  },
  {
    id: 'users_roles',
    title: 'Users & Roles',
    description: 'Define who will use your app and their permissions',
    icon: '👥',
    questions: [
      {
        id: 'user_types',
        label: 'What types of users will your app have?',
        type: 'multiselect',
        required: true,
        options: [
          { value: 'end_user', label: 'End Users / Customers' },
          { value: 'admin', label: 'Administrators' },
          { value: 'moderator', label: 'Moderators' },
          { value: 'vendor', label: 'Vendors / Sellers' },
          { value: 'support', label: 'Support Staff' },
          { value: 'manager', label: 'Managers' },
          { value: 'guest', label: 'Guest Users' },
          { value: 'api_client', label: 'API Clients / Partners' }
        ],
        featureMapping: ['RBAC', 'User Management']
      },
      {
        id: 'needs_rbac',
        label: 'Do you need role-based access control (RBAC)?',
        type: 'toggle',
        tooltip: 'RBAC allows you to define what each user role can see and do',
        featureMapping: ['RBAC', 'Permission System', 'Admin Audit Log']
      },
      {
        id: 'rbac_complexity',
        label: 'How complex are your permission needs?',
        type: 'select',
        visibleIf: { questionId: 'needs_rbac', operator: 'equals', value: true },
        options: [
          { value: 'simple', label: 'Simple - Admin vs User' },
          { value: 'moderate', label: 'Moderate - 3-5 distinct roles' },
          { value: 'complex', label: 'Complex - Dynamic permissions per resource' },
          { value: 'hierarchical', label: 'Hierarchical - Org-based with inheritance' }
        ],
        riskLevel: 'medium'
      },
      {
        id: 'user_profiles',
        label: 'What profile information do users need?',
        type: 'multiselect',
        options: [
          { value: 'basic', label: 'Basic (name, email, avatar)' },
          { value: 'bio', label: 'Bio / About section' },
          { value: 'social_links', label: 'Social media links' },
          { value: 'location', label: 'Location' },
          { value: 'preferences', label: 'Preferences / Settings' },
          { value: 'verification', label: 'Verification badges' },
          { value: 'portfolio', label: 'Portfolio / Work samples' }
        ]
      },
      {
        id: 'team_orgs',
        label: 'Do users belong to teams or organizations?',
        type: 'toggle',
        featureMapping: ['Team Management', 'Org Hierarchy']
      },
      {
        id: 'org_structure',
        label: 'Describe your organization structure',
        type: 'select',
        visibleIf: { questionId: 'team_orgs', operator: 'equals', value: true },
        options: [
          { value: 'flat', label: 'Flat - Simple team membership' },
          { value: 'hierarchical', label: 'Hierarchical - Teams within orgs' },
          { value: 'matrix', label: 'Matrix - Users in multiple teams' },
          { value: 'multi_tenant', label: 'Multi-tenant - Completely separate orgs' }
        ],
        riskLevel: 'high'
      }
    ]
  },
  {
    id: 'platforms',
    title: 'Platforms & Interfaces',
    description: 'Choose where your app will be available',
    icon: '📱',
    questions: [
      {
        id: 'platforms',
        label: 'Which platforms do you need?',
        type: 'multiselect',
        required: true,
        options: [
          { value: 'web', label: 'Web Application' },
          { value: 'ios', label: 'iOS App' },
          { value: 'android', label: 'Android App' },
          { value: 'desktop', label: 'Desktop App' },
          { value: 'tablet', label: 'Tablet-optimized' },
          { value: 'tv', label: 'TV / Large Screen' },
          { value: 'wearable', label: 'Wearable / Watch' }
        ]
      },
      {
        id: 'mobile_permissions',
        label: 'Which device permissions are needed?',
        type: 'multiselect',
        visibleIf: { questionId: 'platforms', operator: 'includes', value: ['ios', 'android'] },
        options: [
          { value: 'camera', label: 'Camera' },
          { value: 'photos', label: 'Photo Library' },
          { value: 'location', label: 'Location' },
          { value: 'notifications', label: 'Push Notifications' },
          { value: 'contacts', label: 'Contacts' },
          { value: 'microphone', label: 'Microphone' },
          { value: 'bluetooth', label: 'Bluetooth' },
          { value: 'nfc', label: 'NFC' },
          { value: 'biometrics', label: 'Biometrics (Face/Touch ID)' }
        ]
      },
      {
        id: 'offline_mode',
        label: 'Do you need offline functionality?',
        type: 'toggle',
        visibleIf: { questionId: 'platforms', operator: 'includes', value: ['ios', 'android'] },
        tooltip: 'Allow users to use core features without internet',
        riskLevel: 'high',
        featureMapping: ['Offline Mode', 'Data Sync', 'Conflict Resolution']
      },
      {
        id: 'app_store_needs',
        label: 'App store distribution requirements',
        type: 'multiselect',
        visibleIf: { questionId: 'platforms', operator: 'includes', value: ['ios', 'android'] },
        options: [
          { value: 'public', label: 'Public app store listing' },
          { value: 'enterprise', label: 'Enterprise distribution' },
          { value: 'testflight', label: 'Beta testing (TestFlight/Play Beta)' },
          { value: 'mdm', label: 'MDM / Device management' }
        ]
      },
      {
        id: 'web_seo',
        label: 'Do you need SEO optimization?',
        type: 'toggle',
        visibleIf: { questionId: 'platforms', operator: 'includes', value: ['web'] },
        featureMapping: ['SEO', 'Meta Tags', 'Sitemap']
      },
      {
        id: 'web_public_pages',
        label: 'Will there be public-facing pages?',
        type: 'toggle',
        visibleIf: { questionId: 'platforms', operator: 'includes', value: ['web'] }
      },
      {
        id: 'web_rendering',
        label: 'Preferred rendering strategy',
        type: 'select',
        visibleIf: { questionId: 'platforms', operator: 'includes', value: ['web'] },
        options: [
          { value: 'spa', label: 'SPA - Single Page Application' },
          { value: 'ssr', label: 'SSR - Server Side Rendering' },
          { value: 'ssg', label: 'SSG - Static Site Generation' },
          { value: 'hybrid', label: 'Hybrid - Mix of approaches' }
        ],
        tooltip: 'SSR/SSG improve SEO and initial load time but add complexity'
      },
      {
        id: 'cookie_consent',
        label: 'Do you need cookie consent management?',
        type: 'toggle',
        visibleIf: { questionId: 'platforms', operator: 'includes', value: ['web'] },
        featureMapping: ['Cookie Consent', 'Privacy Controls']
      }
    ]
  },
  {
    id: 'user_journeys',
    title: 'Core User Journeys',
    description: 'Map out the primary flows users will take',
    icon: '🚀',
    questions: [
      {
        id: 'primary_actions',
        label: 'What are the 3-5 primary actions users take?',
        type: 'textarea',
        required: true,
        placeholder: 'e.g., 1. Browse products\n2. Add to cart\n3. Checkout\n4. Track order\n5. Leave review'
      },
      {
        id: 'onboarding_type',
        label: 'What type of onboarding do you need?',
        type: 'select',
        options: [
          { value: 'none', label: 'None - Direct access' },
          { value: 'simple', label: 'Simple - Quick tour' },
          { value: 'progressive', label: 'Progressive - Reveal features over time' },
          { value: 'wizard', label: 'Wizard - Step-by-step setup' },
          { value: 'personalized', label: 'Personalized - Based on user type' }
        ],
        featureMapping: ['Onboarding Flow', 'User Progress Tracking']
      },
      {
        id: 'needs_backend',
        label: 'Does your app need a backend/database?',
        type: 'toggle',
        required: true
      },
      {
        id: 'api_type',
        label: 'Preferred API architecture',
        type: 'select',
        visibleIf: { questionId: 'needs_backend', operator: 'equals', value: true },
        options: [
          { value: 'rest', label: 'REST API' },
          { value: 'graphql', label: 'GraphQL' },
          { value: 'grpc', label: 'gRPC' },
          { value: 'realtime', label: 'Real-time (WebSockets/SSE)' },
          { value: 'hybrid', label: 'Hybrid approach' }
        ]
      },
      {
        id: 'database_type',
        label: 'Database requirements',
        type: 'multiselect',
        visibleIf: { questionId: 'needs_backend', operator: 'equals', value: true },
        options: [
          { value: 'relational', label: 'Relational (PostgreSQL, MySQL)' },
          { value: 'document', label: 'Document (MongoDB, Firestore)' },
          { value: 'key_value', label: 'Key-Value (Redis)' },
          { value: 'search', label: 'Search (Elasticsearch, Algolia)' },
          { value: 'vector', label: 'Vector DB (Pinecone, Weaviate)' },
          { value: 'time_series', label: 'Time Series (InfluxDB)' }
        ]
      },
      {
        id: 'file_storage',
        label: 'Do you need file/media storage?',
        type: 'toggle',
        visibleIf: { questionId: 'needs_backend', operator: 'equals', value: true },
        featureMapping: ['File Storage', 'Media Upload']
      }
    ]
  },
  {
    id: 'authentication',
    title: 'Authentication & Accounts',
    description: 'Set up user identity and access',
    icon: '🔐',
    questions: [
      {
        id: 'auth_methods',
        label: 'Which authentication methods do you need?',
        type: 'multiselect',
        required: true,
        options: [
          { value: 'email_password', label: 'Email & Password' },
          { value: 'magic_link', label: 'Magic Link (passwordless)' },
          { value: 'google', label: 'Google OAuth' },
          { value: 'apple', label: 'Apple Sign In' },
          { value: 'facebook', label: 'Facebook Login' },
          { value: 'github', label: 'GitHub OAuth' },
          { value: 'microsoft', label: 'Microsoft/Azure AD' },
          { value: 'sso', label: 'SSO (SAML/OIDC)' },
          { value: 'phone', label: 'Phone/SMS OTP' },
          { value: 'anonymous', label: 'Anonymous / Guest' }
        ],
        featureMapping: ['User Authentication', 'Session Management']
      },
      {
        id: 'mfa_required',
        label: 'Do you need Multi-Factor Authentication (MFA)?',
        type: 'toggle',
        tooltip: 'Adds extra security for sensitive operations',
        featureMapping: ['MFA', 'Security Tokens']
      },
      {
        id: 'session_management',
        label: 'Session management needs',
        type: 'multiselect',
        options: [
          { value: 'remember_me', label: 'Remember me option' },
          { value: 'multi_device', label: 'Multi-device sessions' },
          { value: 'session_list', label: 'View active sessions' },
          { value: 'force_logout', label: 'Force logout other sessions' },
          { value: 'inactivity_timeout', label: 'Inactivity timeout' }
        ]
      },
      {
        id: 'account_features',
        label: 'Account management features needed',
        type: 'multiselect',
        options: [
          { value: 'password_reset', label: 'Password reset' },
          { value: 'email_change', label: 'Change email' },
          { value: 'delete_account', label: 'Account deletion' },
          { value: 'data_export', label: 'Data export (GDPR)' },
          { value: 'deactivate', label: 'Account deactivation' },
          { value: 'merge_accounts', label: 'Account merging' }
        ]
      }
    ]
  },
  {
    id: 'social',
    title: 'Social & Community',
    description: 'Add social features and community elements',
    icon: '💬',
    questions: [
      {
        id: 'social_enabled',
        label: 'Does your app need social/community features?',
        type: 'toggle'
      },
      {
        id: 'social_features',
        label: 'Which social features do you need?',
        type: 'multiselect',
        visibleIf: { questionId: 'social_enabled', operator: 'equals', value: true },
        options: [
          { value: 'likes', label: 'Likes / Reactions' },
          { value: 'comments', label: 'Comments' },
          { value: 'follow', label: 'Follow / Subscribe' },
          { value: 'share', label: 'Share / Repost' },
          { value: 'mentions', label: '@Mentions' },
          { value: 'hashtags', label: 'Hashtags' },
          { value: 'feed', label: 'Activity Feed' },
          { value: 'stories', label: 'Stories / Ephemeral content' }
        ],
        featureMapping: ['Social Graph', 'Activity Feed', 'Engagement Metrics']
      },
      {
        id: 'feed_type',
        label: 'What type of feed do you need?',
        type: 'select',
        visibleIf: { questionId: 'social_features', operator: 'includes', value: ['feed'] },
        options: [
          { value: 'chronological', label: 'Chronological' },
          { value: 'algorithmic', label: 'Algorithmic / Ranked' },
          { value: 'mixed', label: 'Mixed (Following + Discover)' }
        ],
        riskLevel: 'medium'
      },
      {
        id: 'trending',
        label: 'Do you need trending/discover features?',
        type: 'toggle',
        visibleIf: { questionId: 'social_enabled', operator: 'equals', value: true },
        featureMapping: ['Trending Algorithm', 'Discovery Feed']
      },
      {
        id: 'ugc_enabled',
        label: 'Will users create content (UGC)?',
        type: 'toggle'
      },
      {
        id: 'moderation_features',
        label: 'Content moderation features needed',
        type: 'multiselect',
        visibleIf: { questionId: 'ugc_enabled', operator: 'equals', value: true },
        options: [
          { value: 'report', label: 'Report content' },
          { value: 'block', label: 'Block users' },
          { value: 'mute', label: 'Mute users' },
          { value: 'auto_mod', label: 'Auto-moderation (AI)' },
          { value: 'manual_review', label: 'Manual review queue' },
          { value: 'spam_filter', label: 'Spam filtering' },
          { value: 'word_filter', label: 'Word/phrase filtering' }
        ],
        featureMapping: ['Content Moderation', 'Report System', 'Block/Mute']
      }
    ]
  },
  {
    id: 'content_media',
    title: 'Content & Media',
    description: 'Define your content types and media handling',
    icon: '🎨',
    questions: [
      {
        id: 'media_types',
        label: 'What types of media will users interact with?',
        type: 'multiselect',
        options: [
          { value: 'images', label: 'Images' },
          { value: 'video', label: 'Video' },
          { value: 'audio', label: 'Audio' },
          { value: 'documents', label: 'Documents (PDF, etc.)' },
          { value: 'rich_text', label: 'Rich Text / Articles' },
          { value: '3d', label: '3D Models / AR' }
        ]
      },
      {
        id: 'video_type',
        label: 'Video handling approach',
        type: 'select',
        visibleIf: { questionId: 'media_types', operator: 'includes', value: ['video'] },
        options: [
          { value: 'upload', label: 'File upload only' },
          { value: 'streaming', label: 'Streaming playback' },
          { value: 'live', label: 'Live streaming' },
          { value: 'recording', label: 'In-app recording' }
        ],
        riskLevel: 'high',
        featureMapping: ['Video Processing', 'Streaming Infrastructure']
      },
      {
        id: 'video_limits',
        label: 'Video size/duration limits',
        type: 'select',
        visibleIf: { questionId: 'media_types', operator: 'includes', value: ['video'] },
        options: [
          { value: 'short', label: 'Short clips (< 1 min)' },
          { value: 'medium', label: 'Medium (1-10 min)' },
          { value: 'long', label: 'Long form (> 10 min)' },
          { value: 'unlimited', label: 'No limits' }
        ]
      },
      {
        id: 'cdn_needed',
        label: 'Do you need CDN for media delivery?',
        type: 'toggle',
        visibleIf: { questionId: 'media_types', operator: 'hasValue' },
        tooltip: 'CDN improves load times globally',
        featureMapping: ['CDN Integration', 'Media Optimization']
      },
      {
        id: 'image_processing',
        label: 'Image processing features needed',
        type: 'multiselect',
        visibleIf: { questionId: 'media_types', operator: 'includes', value: ['images'] },
        options: [
          { value: 'resize', label: 'Automatic resizing' },
          { value: 'crop', label: 'User cropping' },
          { value: 'filters', label: 'Filters / Effects' },
          { value: 'watermark', label: 'Watermarking' },
          { value: 'ocr', label: 'OCR / Text extraction' },
          { value: 'face_detection', label: 'Face detection' }
        ]
      }
    ]
  },
  {
    id: 'chat_realtime',
    title: 'Chat & Real-time',
    description: 'Configure messaging and real-time features',
    icon: '⚡',
    questions: [
      {
        id: 'chat_enabled',
        label: 'Does your app need chat/messaging?',
        type: 'toggle'
      },
      {
        id: 'chat_type',
        label: 'What type of chat do you need?',
        type: 'multiselect',
        visibleIf: { questionId: 'chat_enabled', operator: 'equals', value: true },
        options: [
          { value: 'one_on_one', label: '1:1 Direct messages' },
          { value: 'group', label: 'Group chats' },
          { value: 'channels', label: 'Public channels' },
          { value: 'threads', label: 'Threaded replies' },
          { value: 'support', label: 'Customer support chat' },
          { value: 'bot', label: 'Chatbot integration' }
        ],
        riskLevel: 'medium',
        featureMapping: ['Chat System', 'Message History']
      },
      {
        id: 'chat_features',
        label: 'Chat features needed',
        type: 'multiselect',
        visibleIf: { questionId: 'chat_enabled', operator: 'equals', value: true },
        options: [
          { value: 'read_receipts', label: 'Read receipts' },
          { value: 'typing', label: 'Typing indicators' },
          { value: 'reactions', label: 'Message reactions' },
          { value: 'attachments', label: 'File attachments' },
          { value: 'voice', label: 'Voice messages' },
          { value: 'video_call', label: 'Video calls' },
          { value: 'screen_share', label: 'Screen sharing' },
          { value: 'encryption', label: 'End-to-end encryption' }
        ],
        featureMapping: ['Real-time Messaging', 'Media Attachments']
      },
      {
        id: 'realtime_other',
        label: 'Other real-time features needed',
        type: 'multiselect',
        options: [
          { value: 'presence', label: 'User presence (online/offline)' },
          { value: 'live_updates', label: 'Live data updates' },
          { value: 'collaboration', label: 'Real-time collaboration' },
          { value: 'cursors', label: 'Live cursors / Co-editing' },
          { value: 'sync', label: 'Cross-device sync' }
        ],
        riskLevel: 'high',
        featureMapping: ['WebSocket Infrastructure', 'Presence System']
      }
    ]
  },
  {
    id: 'location_maps',
    title: 'Location & Maps',
    description: 'Add geolocation and mapping features',
    icon: '📍',
    questions: [
      {
        id: 'maps_enabled',
        label: 'Does your app need location/maps features?',
        type: 'toggle'
      },
      {
        id: 'map_features',
        label: 'Which map features do you need?',
        type: 'multiselect',
        visibleIf: { questionId: 'maps_enabled', operator: 'equals', value: true },
        options: [
          { value: 'display', label: 'Display maps' },
          { value: 'markers', label: 'Location markers' },
          { value: 'search', label: 'Location search' },
          { value: 'geocoding', label: 'Address geocoding' },
          { value: 'directions', label: 'Directions / Routing' },
          { value: 'distance', label: 'Distance calculation' },
          { value: 'clustering', label: 'Marker clustering' }
        ],
        featureMapping: ['Map Integration', 'Location Services']
      },
      {
        id: 'live_location',
        label: 'Do you need live location tracking?',
        type: 'toggle',
        visibleIf: { questionId: 'maps_enabled', operator: 'equals', value: true },
        riskLevel: 'high',
        featureMapping: ['Live Location', 'Location History']
      },
      {
        id: 'geofencing',
        label: 'Do you need geofencing?',
        type: 'toggle',
        visibleIf: { questionId: 'maps_enabled', operator: 'equals', value: true },
        tooltip: 'Trigger actions when users enter/exit defined areas',
        riskLevel: 'medium',
        featureMapping: ['Geofencing', 'Location Triggers']
      },
      {
        id: 'map_provider',
        label: 'Preferred map provider',
        type: 'select',
        visibleIf: { questionId: 'maps_enabled', operator: 'equals', value: true },
        options: [
          { value: 'google', label: 'Google Maps' },
          { value: 'mapbox', label: 'Mapbox' },
          { value: 'apple', label: 'Apple Maps' },
          { value: 'osm', label: 'OpenStreetMap' },
          { value: 'here', label: 'HERE Maps' }
        ]
      }
    ]
  },
  {
    id: 'booking_inventory',
    title: 'Booking & Inventory',
    description: 'Configure reservations and stock management',
    icon: '📅',
    questions: [
      {
        id: 'booking_enabled',
        label: 'Does your app need booking/scheduling features?',
        type: 'toggle'
      },
      {
        id: 'booking_type',
        label: 'What type of booking system?',
        type: 'select',
        visibleIf: { questionId: 'booking_enabled', operator: 'equals', value: true },
        options: [
          { value: 'appointments', label: 'Appointments / Services' },
          { value: 'reservations', label: 'Table / Seat reservations' },
          { value: 'rentals', label: 'Rentals (daily/hourly)' },
          { value: 'events', label: 'Event tickets' },
          { value: 'classes', label: 'Classes / Workshops' }
        ],
        featureMapping: ['Booking System', 'Availability Management']
      },
      {
        id: 'booking_features',
        label: 'Booking features needed',
        type: 'multiselect',
        visibleIf: { questionId: 'booking_enabled', operator: 'equals', value: true },
        options: [
          { value: 'slots', label: 'Time slot management' },
          { value: 'capacity', label: 'Capacity limits' },
          { value: 'waitlist', label: 'Waitlist' },
          { value: 'recurring', label: 'Recurring bookings' },
          { value: 'cancellation', label: 'Cancellation policy' },
          { value: 'reminders', label: 'Booking reminders' },
          { value: 'calendar_sync', label: 'Calendar sync (Google, iCal)' },
          { value: 'buffer_time', label: 'Buffer time between bookings' }
        ],
        riskLevel: 'medium'
      },
      {
        id: 'multi_location',
        label: 'Do you need multi-location support?',
        type: 'toggle',
        visibleIf: { questionId: 'booking_enabled', operator: 'equals', value: true },
        featureMapping: ['Multi-location', 'Branch Management']
      },
      {
        id: 'inventory_enabled',
        label: 'Do you need inventory/stock management?',
        type: 'toggle'
      },
      {
        id: 'inventory_features',
        label: 'Inventory features needed',
        type: 'multiselect',
        visibleIf: { questionId: 'inventory_enabled', operator: 'equals', value: true },
        options: [
          { value: 'stock_tracking', label: 'Stock level tracking' },
          { value: 'low_stock_alerts', label: 'Low stock alerts' },
          { value: 'variants', label: 'Product variants (size, color)' },
          { value: 'bundles', label: 'Product bundles' },
          { value: 'barcode', label: 'Barcode/SKU scanning' },
          { value: 'warehouse', label: 'Multi-warehouse' }
        ],
        featureMapping: ['Inventory System', 'Stock Management']
      }
    ]
  },
  {
    id: 'payments',
    title: 'Payments & Monetization',
    description: 'Set up payment processing and revenue models',
    icon: '💳',
    questions: [
      {
        id: 'payments_enabled',
        label: 'Does your app need payment processing?',
        type: 'toggle'
      },
      {
        id: 'payment_gateway',
        label: 'Preferred payment gateway',
        type: 'multiselect',
        visibleIf: { questionId: 'payments_enabled', operator: 'equals', value: true },
        options: [
          { value: 'stripe', label: 'Stripe' },
          { value: 'paypal', label: 'PayPal' },
          { value: 'square', label: 'Square' },
          { value: 'braintree', label: 'Braintree' },
          { value: 'adyen', label: 'Adyen' },
          { value: 'apple_pay', label: 'Apple Pay' },
          { value: 'google_pay', label: 'Google Pay' }
        ],
        featureMapping: ['Payment Processing', 'Checkout Flow']
      },
      {
        id: 'payment_model',
        label: 'Revenue model',
        type: 'multiselect',
        visibleIf: { questionId: 'payments_enabled', operator: 'equals', value: true },
        options: [
          { value: 'one_time', label: 'One-time purchases' },
          { value: 'subscription', label: 'Subscriptions' },
          { value: 'marketplace', label: 'Marketplace (platform fees)' },
          { value: 'in_app', label: 'In-app purchases' },
          { value: 'freemium', label: 'Freemium model' },
          { value: 'credits', label: 'Credit/token system' },
          { value: 'tips', label: 'Tips / Donations' }
        ],
        riskLevel: 'high',
        featureMapping: ['Revenue Model', 'Billing System']
      },
      {
        id: 'currency_handling',
        label: 'Currency requirements',
        type: 'select',
        visibleIf: { questionId: 'payments_enabled', operator: 'equals', value: true },
        options: [
          { value: 'single', label: 'Single currency' },
          { value: 'multi_display', label: 'Multi-currency display' },
          { value: 'multi_process', label: 'Multi-currency processing' },
          { value: 'crypto', label: 'Cryptocurrency support' }
        ]
      },
      {
        id: 'payment_features',
        label: 'Additional payment features',
        type: 'multiselect',
        visibleIf: { questionId: 'payments_enabled', operator: 'equals', value: true },
        options: [
          { value: 'refunds', label: 'Refund handling' },
          { value: 'invoices', label: 'Invoice generation' },
          { value: 'receipts', label: 'Receipts' },
          { value: 'promo_codes', label: 'Promo codes / Discounts' },
          { value: 'saved_cards', label: 'Saved payment methods' },
          { value: 'split_payments', label: 'Split payments' },
          { value: 'payouts', label: 'Vendor payouts' },
          { value: 'tax', label: 'Tax calculation' }
        ],
        featureMapping: ['Order Management', 'Financial Reports']
      }
    ]
  },
  {
    id: 'notifications',
    title: 'Notifications',
    description: 'Configure how users receive updates',
    icon: '🔔',
    questions: [
      {
        id: 'notifications_enabled',
        label: 'Does your app need notifications?',
        type: 'toggle'
      },
      {
        id: 'notification_channels',
        label: 'Which notification channels?',
        type: 'multiselect',
        visibleIf: { questionId: 'notifications_enabled', operator: 'equals', value: true },
        options: [
          { value: 'push', label: 'Push notifications' },
          { value: 'email', label: 'Email' },
          { value: 'sms', label: 'SMS' },
          { value: 'in_app', label: 'In-app notifications' },
          { value: 'slack', label: 'Slack' },
          { value: 'webhook', label: 'Webhooks' }
        ],
        featureMapping: ['Notification System', 'Email Templates']
      },
      {
        id: 'notification_triggers',
        label: 'What triggers notifications?',
        type: 'multiselect',
        visibleIf: { questionId: 'notifications_enabled', operator: 'equals', value: true },
        options: [
          { value: 'transactional', label: 'Transactional (orders, receipts)' },
          { value: 'social', label: 'Social (likes, comments, follows)' },
          { value: 'marketing', label: 'Marketing / Promotional' },
          { value: 'reminders', label: 'Reminders / Scheduled' },
          { value: 'alerts', label: 'System alerts' },
          { value: 'digest', label: 'Digest / Summary' }
        ]
      },
      {
        id: 'notification_preferences',
        label: 'Do users need notification preferences?',
        type: 'toggle',
        visibleIf: { questionId: 'notifications_enabled', operator: 'equals', value: true },
        featureMapping: ['Notification Preferences', 'Unsubscribe Flow']
      }
    ]
  },
  {
    id: 'admin_operations',
    title: 'Admin & Operations',
    description: 'Configure administrative capabilities',
    icon: '⚙️',
    questions: [
      {
        id: 'admin_enabled',
        label: 'Do you need an admin panel?',
        type: 'toggle'
      },
      {
        id: 'admin_modules',
        label: 'Which admin modules do you need?',
        type: 'multiselect',
        visibleIf: { questionId: 'admin_enabled', operator: 'equals', value: true },
        options: [
          { value: 'user_management', label: 'User management' },
          { value: 'content_management', label: 'Content management' },
          { value: 'order_management', label: 'Order management' },
          { value: 'analytics_dashboard', label: 'Analytics dashboard' },
          { value: 'settings', label: 'System settings' },
          { value: 'reports', label: 'Reports & Exports' },
          { value: 'support_tools', label: 'Support tools' }
        ],
        featureMapping: ['Admin Dashboard', 'CRUD Operations']
      },
      {
        id: 'admin_features',
        label: 'Additional admin features',
        type: 'multiselect',
        visibleIf: { questionId: 'admin_enabled', operator: 'equals', value: true },
        options: [
          { value: 'impersonation', label: 'User impersonation' },
          { value: 'audit_logs', label: 'Audit logs' },
          { value: 'bulk_actions', label: 'Bulk actions' },
          { value: 'data_export', label: 'Data export' },
          { value: 'feature_flags', label: 'Feature flags' },
          { value: 'maintenance_mode', label: 'Maintenance mode' }
        ],
        riskLevel: 'medium',
        featureMapping: ['Audit Trail', 'Admin Tools']
      },
      {
        id: 'support_features',
        label: 'Customer support features',
        type: 'multiselect',
        options: [
          { value: 'help_center', label: 'Help center / FAQ' },
          { value: 'ticket_system', label: 'Ticket system' },
          { value: 'live_chat', label: 'Live chat support' },
          { value: 'feedback', label: 'Feedback collection' },
          { value: 'bug_reporting', label: 'Bug reporting' }
        ]
      }
    ]
  },
  {
    id: 'integrations',
    title: 'Integrations & Devices',
    description: 'Connect with external services and devices',
    icon: '🔗',
    questions: [
      {
        id: 'third_party_integrations',
        label: 'Which third-party integrations do you need?',
        type: 'multiselect',
        options: [
          { value: 'crm', label: 'CRM (Salesforce, HubSpot)' },
          { value: 'analytics', label: 'Analytics (GA, Mixpanel, Amplitude)' },
          { value: 'email_marketing', label: 'Email marketing (Mailchimp, SendGrid)' },
          { value: 'calendar', label: 'Calendar (Google, Outlook)' },
          { value: 'storage', label: 'Cloud storage (Dropbox, Google Drive)' },
          { value: 'social', label: 'Social media APIs' },
          { value: 'erp', label: 'ERP systems' },
          { value: 'accounting', label: 'Accounting (QuickBooks, Xero)' }
        ],
        featureMapping: ['Third-party Integrations', 'API Connections']
      },
      {
        id: 'api_public',
        label: 'Do you need a public API for third parties?',
        type: 'toggle',
        featureMapping: ['Public API', 'API Documentation', 'Rate Limiting']
      },
      {
        id: 'webhooks_outgoing',
        label: 'Do you need outgoing webhooks?',
        type: 'toggle',
        featureMapping: ['Webhook System', 'Event Notifications']
      },
      {
        id: 'device_integrations',
        label: 'Device/hardware integrations needed',
        type: 'multiselect',
        options: [
          { value: 'printer', label: 'Printers' },
          { value: 'scanner', label: 'Barcode scanners' },
          { value: 'pos', label: 'POS terminals' },
          { value: 'iot', label: 'IoT devices' },
          { value: 'wearables', label: 'Wearables' },
          { value: 'smart_home', label: 'Smart home devices' }
        ],
        riskLevel: 'high'
      }
    ]
  },
  {
    id: 'localization',
    title: 'Localization & Accessibility',
    description: 'Make your app accessible to everyone',
    icon: '🌍',
    questions: [
      {
        id: 'languages',
        label: 'Which languages do you need to support?',
        type: 'multiselect',
        options: [
          { value: 'en', label: 'English' },
          { value: 'es', label: 'Spanish' },
          { value: 'fr', label: 'French' },
          { value: 'de', label: 'German' },
          { value: 'pt', label: 'Portuguese' },
          { value: 'zh', label: 'Chinese' },
          { value: 'ja', label: 'Japanese' },
          { value: 'ar', label: 'Arabic (RTL)' },
          { value: 'other', label: 'Other languages' }
        ],
        featureMapping: ['i18n', 'Translation System']
      },
      {
        id: 'rtl_support',
        label: 'Do you need RTL (right-to-left) support?',
        type: 'toggle',
        visibleIf: { questionId: 'languages', operator: 'includes', value: ['ar'] },
        featureMapping: ['RTL Layout']
      },
      {
        id: 'timezone_handling',
        label: 'How should timezones be handled?',
        type: 'select',
        options: [
          { value: 'single', label: 'Single timezone' },
          { value: 'user_tz', label: 'User timezone' },
          { value: 'multi_tz', label: 'Multiple business timezones' }
        ]
      },
      {
        id: 'accessibility_level',
        label: 'Accessibility compliance level',
        type: 'select',
        options: [
          { value: 'basic', label: 'Basic (keyboard navigation, alt text)' },
          { value: 'wcag_a', label: 'WCAG 2.1 Level A' },
          { value: 'wcag_aa', label: 'WCAG 2.1 Level AA' },
          { value: 'wcag_aaa', label: 'WCAG 2.1 Level AAA' }
        ],
        featureMapping: ['Accessibility', 'Screen Reader Support']
      },
      {
        id: 'accessibility_features',
        label: 'Specific accessibility features',
        type: 'multiselect',
        options: [
          { value: 'keyboard_nav', label: 'Full keyboard navigation' },
          { value: 'screen_reader', label: 'Screen reader optimization' },
          { value: 'high_contrast', label: 'High contrast mode' },
          { value: 'font_scaling', label: 'Font scaling' },
          { value: 'reduce_motion', label: 'Reduced motion' },
          { value: 'captions', label: 'Video captions' }
        ]
      }
    ]
  },
  {
    id: 'ai_features',
    title: 'AI Features',
    description: 'Add artificial intelligence capabilities',
    icon: '🤖',
    questions: [
      {
        id: 'ai_enabled',
        label: 'Does your app need AI features?',
        type: 'toggle'
      },
      {
        id: 'ai_use_cases',
        label: 'Which AI use cases do you need?',
        type: 'multiselect',
        visibleIf: { questionId: 'ai_enabled', operator: 'equals', value: true },
        options: [
          { value: 'chatbot', label: 'AI Chatbot / Assistant' },
          { value: 'recommendations', label: 'Personalized recommendations' },
          { value: 'search', label: 'Semantic search' },
          { value: 'content_gen', label: 'Content generation' },
          { value: 'summarization', label: 'Text summarization' },
          { value: 'translation', label: 'AI translation' },
          { value: 'image_gen', label: 'Image generation' },
          { value: 'image_analysis', label: 'Image analysis' },
          { value: 'voice', label: 'Voice/Speech AI' },
          { value: 'prediction', label: 'Predictive analytics' }
        ],
        riskLevel: 'high',
        featureMapping: ['AI Integration', 'LLM System']
      },
      {
        id: 'ai_knowledge_base',
        label: 'Do you need RAG / Knowledge base?',
        type: 'toggle',
        visibleIf: { questionId: 'ai_enabled', operator: 'equals', value: true },
        tooltip: 'Retrieval-Augmented Generation allows AI to reference your data',
        riskLevel: 'high',
        featureMapping: ['RAG System', 'Vector Database', 'Embeddings']
      },
      {
        id: 'ai_safety',
        label: 'AI safety measures needed',
        type: 'multiselect',
        visibleIf: { questionId: 'ai_enabled', operator: 'equals', value: true },
        options: [
          { value: 'content_filter', label: 'Content filtering' },
          { value: 'rate_limit', label: 'Rate limiting' },
          { value: 'human_review', label: 'Human review option' },
          { value: 'prompt_injection', label: 'Prompt injection protection' },
          { value: 'logging', label: 'AI interaction logging' },
          { value: 'cost_limits', label: 'Cost/usage limits' }
        ],
        featureMapping: ['AI Safety', 'Usage Controls']
      }
    ]
  },
  {
    id: 'security_privacy',
    title: 'Security & Privacy',
    description: 'Configure security requirements and compliance',
    icon: '🛡️',
    questions: [
      {
        id: 'security_level',
        label: 'Required security level',
        type: 'select',
        options: [
          { value: 'standard', label: 'Standard (HTTPS, basic auth)' },
          { value: 'enhanced', label: 'Enhanced (encryption at rest, audit logs)' },
          { value: 'enterprise', label: 'Enterprise (SOC2, penetration testing)' },
          { value: 'regulated', label: 'Regulated (HIPAA, PCI-DSS, etc.)' }
        ],
        featureMapping: ['Security Architecture', 'Encryption']
      },
      {
        id: 'compliance_requirements',
        label: 'Compliance requirements',
        type: 'multiselect',
        options: [
          { value: 'gdpr', label: 'GDPR' },
          { value: 'ccpa', label: 'CCPA' },
          { value: 'hipaa', label: 'HIPAA' },
          { value: 'pci', label: 'PCI-DSS' },
          { value: 'soc2', label: 'SOC 2' },
          { value: 'iso27001', label: 'ISO 27001' }
        ],
        riskLevel: 'high',
        featureMapping: ['Compliance', 'Data Protection']
      },
      {
        id: 'data_handling',
        label: 'Special data handling needs',
        type: 'multiselect',
        options: [
          { value: 'encryption', label: 'End-to-end encryption' },
          { value: 'data_residency', label: 'Data residency requirements' },
          { value: 'backup', label: 'Automated backups' },
          { value: 'retention', label: 'Data retention policies' },
          { value: 'anonymization', label: 'Data anonymization' },
          { value: 'right_to_delete', label: 'Right to deletion' }
        ]
      },
      {
        id: 'security_features',
        label: 'Security features needed',
        type: 'multiselect',
        options: [
          { value: 'ip_allowlist', label: 'IP allowlisting' },
          { value: 'rate_limiting', label: 'Rate limiting' },
          { value: 'captcha', label: 'CAPTCHA protection' },
          { value: 'fraud_detection', label: 'Fraud detection' },
          { value: 'security_headers', label: 'Security headers' },
          { value: 'vulnerability_scan', label: 'Vulnerability scanning' }
        ],
        featureMapping: ['Security Features', 'Threat Protection']
      }
    ]
  },
  {
    id: 'analytics_kpis',
    title: 'Analytics & KPIs',
    description: 'Define what you need to measure',
    icon: '📊',
    questions: [
      {
        id: 'analytics_provider',
        label: 'Preferred analytics provider',
        type: 'multiselect',
        options: [
          { value: 'google_analytics', label: 'Google Analytics' },
          { value: 'mixpanel', label: 'Mixpanel' },
          { value: 'amplitude', label: 'Amplitude' },
          { value: 'segment', label: 'Segment' },
          { value: 'posthog', label: 'PostHog' },
          { value: 'custom', label: 'Custom analytics' }
        ],
        featureMapping: ['Analytics', 'Event Tracking']
      },
      {
        id: 'tracking_needs',
        label: 'What do you need to track?',
        type: 'multiselect',
        options: [
          { value: 'page_views', label: 'Page views' },
          { value: 'user_events', label: 'User events / Actions' },
          { value: 'conversions', label: 'Conversion funnels' },
          { value: 'cohorts', label: 'Cohort analysis' },
          { value: 'attribution', label: 'Marketing attribution' },
          { value: 'revenue', label: 'Revenue metrics' },
          { value: 'errors', label: 'Error tracking' },
          { value: 'performance', label: 'Performance metrics' }
        ]
      },
      {
        id: 'reporting_needs',
        label: 'Reporting requirements',
        type: 'multiselect',
        options: [
          { value: 'dashboards', label: 'Real-time dashboards' },
          { value: 'scheduled_reports', label: 'Scheduled reports' },
          { value: 'custom_reports', label: 'Custom report builder' },
          { value: 'exports', label: 'Data exports' },
          { value: 'alerts', label: 'Automated alerts' }
        ],
        featureMapping: ['Reporting', 'Dashboards']
      },
      {
        id: 'ab_testing',
        label: 'Do you need A/B testing capabilities?',
        type: 'toggle',
        featureMapping: ['A/B Testing', 'Feature Flags', 'Experimentation']
      }
    ]
  },
  {
    id: 'review_export',
    title: 'Review & Export',
    description: 'Review your requirements and export the scope',
    icon: '✅',
    questions: [
      {
        id: 'timeline',
        label: 'Target launch timeline',
        type: 'select',
        options: [
          { value: '1_month', label: 'Less than 1 month' },
          { value: '1_3_months', label: '1-3 months' },
          { value: '3_6_months', label: '3-6 months' },
          { value: '6_12_months', label: '6-12 months' },
          { value: 'over_12', label: 'Over 12 months' }
        ]
      },
      {
        id: 'budget_range',
        label: 'Budget range',
        type: 'select',
        options: [
          { value: 'startup', label: 'Startup (< $50K)' },
          { value: 'small', label: 'Small ($50K - $150K)' },
          { value: 'medium', label: 'Medium ($150K - $500K)' },
          { value: 'enterprise', label: 'Enterprise ($500K+)' }
        ]
      },
      {
        id: 'team_size',
        label: 'Expected development team size',
        type: 'select',
        options: [
          { value: 'solo', label: 'Solo developer' },
          { value: 'small', label: 'Small team (2-5)' },
          { value: 'medium', label: 'Medium team (6-15)' },
          { value: 'large', label: 'Large team (15+)' }
        ]
      },
      {
        id: 'additional_notes',
        label: 'Any additional notes or requirements?',
        type: 'textarea',
        placeholder: 'Anything else we should know about your project...'
      },
      {
        id: 'open_questions',
        label: 'What questions do you still have?',
        type: 'textarea',
        placeholder: 'List any uncertainties or decisions that need more discussion...'
      }
    ]
  }
];

export const HIGH_RISK_FEATURES = [
  'realtime',
  'live_location',
  'video_streaming',
  'live_streaming',
  'multi_tenant',
  'encryption',
  'ai_enabled',
  'ai_knowledge_base',
  'offline_mode',
  'payments_enabled',
  'compliance_requirements'
];

export const FEATURE_MAPPING: Record<string, { mvp: string[]; v1: string[]; later: string[] }> = {
  payments_enabled: {
    mvp: ['Checkout flow', 'Order states', 'Receipts'],
    v1: ['Refund handling', 'Promo codes', 'Saved cards'],
    later: ['Split payments', 'Multi-currency', 'Subscription management']
  },
  needs_rbac: {
    mvp: ['Basic role assignment', 'Permission checks'],
    v1: ['Admin audit log', 'Role management UI'],
    later: ['Dynamic permissions', 'Role inheritance']
  },
  notifications_enabled: {
    mvp: ['Email notifications', 'In-app notifications'],
    v1: ['Notification preferences', 'Templates'],
    later: ['Push notifications', 'Digest emails']
  },
  chat_enabled: {
    mvp: ['Basic messaging', 'Message history'],
    v1: ['Read receipts', 'Typing indicators', 'Attachments'],
    later: ['Video calls', 'Screen sharing', 'Encryption']
  },
  social_enabled: {
    mvp: ['Likes', 'Comments'],
    v1: ['Follow/Subscribe', 'Activity feed'],
    later: ['Algorithmic feed', 'Trending']
  },
  maps_enabled: {
    mvp: ['Display maps', 'Location markers'],
    v1: ['Location search', 'Directions'],
    later: ['Live location', 'Geofencing']
  },
  booking_enabled: {
    mvp: ['Basic scheduling', 'Availability'],
    v1: ['Waitlist', 'Reminders', 'Calendar sync'],
    later: ['Recurring bookings', 'Multi-location']
  },
  admin_enabled: {
    mvp: ['User management', 'Basic CRUD'],
    v1: ['Analytics dashboard', 'Reports'],
    later: ['Impersonation', 'Audit logs', 'Feature flags']
  },
  ai_enabled: {
    mvp: ['Basic AI integration'],
    v1: ['Rate limiting', 'Cost controls'],
    later: ['RAG/Knowledge base', 'Custom models']
  }
};
