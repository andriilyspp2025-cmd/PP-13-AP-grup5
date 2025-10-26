# Rozklad Features

## Core Features

### 1. Multi-Role Access Control

#### Super Administrator
- Full system control
- Manage institutions, users, and permissions
- Create and finalize master schedules
- Approve all changes
- Access to all analytics and reports

#### Administrator
- Create and edit draft schedules
- Manage groups, teachers, classrooms
- Process daily change requests
- View all schedules within institution
- Cannot delete critical data

#### Teacher
- View personal schedule
- Submit change requests:
  - Class cancellation
  - Request substitute teacher
  - Room change requests
- View change request history
- Receive notifications for schedule updates

#### Student/Parent
- View group/class schedule
- Receive notifications about changes
- View only approved, public schedules
- Access to daily and weekly views

### 2. Schedule Builder (Master Schedule Creation)

#### Data Management
- **Groups/Classes**: Name, student count, specialization
- **Subjects**: Name, type (lecture, lab, practical, gym), description
- **Teachers**: Full details, specialization, preferences, contact info
- **Classrooms**: Name, type, capacity, equipment, location
- **Time Slots**: Customizable periods with start/end times

#### Import Capabilities
- CSV/Excel file import for bulk data
- Template downloads for easy data entry
- Validation on import

#### Schedule Creation Wizard
1. Define curriculum for each group
2. Assign subjects and teachers
3. Specify class frequency (per week)
4. Automatic or manual assignment

#### Conflict Detection System
**Mandatory Rules** (Cannot be violated):
- Prevent teacher double-booking
- Prevent group overlaps
- Prevent classroom conflicts
- Verify room capacity
- Match room type to subject (e.g., gym classes → gymnasium)

**Preferred Rules** (Warnings only):
- Even workload distribution
- Teacher preferences (time, days)
- Optimal room utilization
- Consecutive classes for same group/teacher
- Lunch break preservation

#### Schedule Publishing
- Draft mode for editing
- Approval workflow
- Public/private visibility
- Version control

### 3. Change Management System

#### Change Types

**1. Class Cancellation**
- Teacher illness or absence
- Holiday or special event
- Emergency situations
- Reason documentation required

**2. Teacher Substitution**
- Original teacher unavailable
- System suggests qualified substitutes
- Automatic availability checking
- Notification to substitute teacher

**3. Class Rescheduling**
- Move to different day
- Change time slot
- Conflict detection for new slot
- Update all affected parties

**4. Classroom Change**
- Room renovation
- Equipment issues
- Capacity changes
- Location updates

#### Change Request Workflow

1. **Request Creation**
   - Teacher or admin creates request
   - Select type and provide reason
   - Choose date(s) affected
   - Suggest alternatives (if applicable)

2. **Notification**
   - Admin receives instant notification
   - Request appears in pending queue
   - Urgency indicators

3. **Processing**
   - Admin reviews request
   - Can approve, reject, or modify
   - System checks for conflicts
   - Add admin comments

4. **Smart Suggestions**
   - System suggests available substitute teachers
   - Recommends alternative time slots
   - Shows available classrooms
   - Considers teacher qualifications and preferences

5. **Approval & Notification**
   - Automated notifications to:
     - Students in affected group
     - Original teacher
     - Substitute teacher (if applicable)
     - Classroom managers
   - Email and push notifications
   - In-app notifications

6. **Change History**
   - Complete audit trail
   - View by group, teacher, or date
   - Export capabilities
   - Analytics on change patterns

### 4. Notification System

#### Notification Types
- Schedule changes (all types)
- New change requests (admins)
- Request status updates (requesters)
- Daily schedule reminders
- Emergency alerts

#### Delivery Methods
- In-app notifications
- Push notifications (mobile)
- Email notifications
- SMS (optional, future feature)

#### Notification Settings
- Customize notification types
- Set delivery preferences
- Quiet hours
- Digest options

### 5. User Interface

#### For Administrators
- **Dashboard**: Key metrics, pending requests, today's changes
- **Schedule Grid**: Color-coded, drag-and-drop (future)
- **Multi-View**: By group, teacher, classroom, time
- **Quick Actions**: Fast approve/reject, bulk operations
- **Status Indicators**:
  - Green: Scheduled as planned
  - Yellow: Rescheduled/modified
  - Red: Cancelled
  - Blue: Substitution

#### For Teachers
- **Personal Dashboard**: My schedule, my requests
- **Week View**: Minimalist, clear design
- **Quick Request**: One-click change request
- **History**: All my changes and requests
- **Notifications**: Prominent alert system

#### For Students/Parents
- **Clean Schedule View**: Today and week views
- **Change Highlights**: Visual indicators for changes
- **Search**: Find specific classes or teachers
- **Export**: Save schedule as image or PDF
- **Mobile-First**: Optimized for smartphones

### 6. Analytics & Reports (Future Enhancement)

#### For Administrators
- Schedule utilization
- Classroom occupancy rates
- Teacher workload distribution
- Most common change reasons
- Peak change request times
- Substitute teacher usage

#### Export Formats
- PDF reports
- Excel spreadsheets
- CSV for data analysis
- Calendar formats (iCal, Google Calendar)

### 7. Advanced Features (Roadmap)

#### AI-Powered Schedule Optimization
- Automatic schedule generation
- Machine learning for optimal arrangements
- Predictive analytics for change patterns
- Intelligent substitute suggestions

#### Drag-and-Drop Schedule Builder
- Visual schedule construction
- Real-time conflict detection
- Undo/redo capabilities
- Template scheduling

#### Integration Capabilities
- Student Information Systems (SIS)
- Learning Management Systems (LMS)
- Google Calendar / Outlook
- Microsoft Teams / Zoom (for online classes)
- Attendance systems

#### Mobile Features
- Offline schedule access
- Location-based reminders
- QR code classroom check-in
- Voice commands

#### Communication Features
- In-app messaging
- Group announcements
- Emergency broadcast
- Teacher-student communication

### 8. Security Features

- JWT-based authentication
- Role-based access control (RBAC)
- Password encryption (bcrypt)
- HTTPS/SSL encryption
- Session management
- Activity logging
- GDPR compliance
- Data backup and recovery

### 9. Customization Options

- Institution branding
- Custom color schemes
- Configurable time slots
- Custom subject types
- Flexible academic periods
- Multiple language support (future)

### 10. Performance Features

- Fast API responses
- Efficient database queries
- Caching mechanisms
- Pagination for large datasets
- Optimized for mobile networks
- Progressive Web App (PWA) capabilities

## Technical Highlights

- **Backend**: FastAPI (Python) - Fast, modern, async
- **Frontend**: React 18 + TypeScript - Type-safe, component-based
- **Mobile**: React Native - Cross-platform iOS/Android
- **Database**: PostgreSQL - Reliable, powerful
- **Real-time**: WebSocket support (future)
- **Scalable**: Microservices-ready architecture
- **Maintainable**: Clean code, comprehensive documentation

## Deployment Options

- Docker containers
- Cloud-ready (AWS, Google Cloud, Azure)
- On-premise installation
- Kubernetes orchestration
- Auto-scaling capabilities

