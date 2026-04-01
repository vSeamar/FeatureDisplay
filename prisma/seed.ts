import { PrismaClient } from "@prisma/client";
import bcrypt from "bcryptjs";

const prisma = new PrismaClient();

async function main() {
  console.log("Seeding database...");

  // Clean existing data
  await prisma.taskLabel.deleteMany();
  await prisma.comment.deleteMany();
  await prisma.notification.deleteMany();
  await prisma.activity.deleteMany();
  await prisma.calendarEvent.deleteMany();
  await prisma.document.deleteMany();
  await prisma.task.deleteMany();
  await prisma.label.deleteMany();
  await prisma.projectMember.deleteMany();
  await prisma.project.deleteMany();
  await prisma.user.deleteMany();

  // ──────────────────────────────────────────
  // Users
  // ──────────────────────────────────────────
  const hashedPassword = await bcrypt.hash("password123", 10);

  const users = await Promise.all([
    prisma.user.create({
      data: {
        name: "Demo User",
        email: "demo@taskflow.com",
        password: hashedPassword,
        role: "admin",
        avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Demo",
        bio: "Product manager and team lead. Passionate about building great software.",
      },
    }),
    prisma.user.create({
      data: {
        name: "Sarah Chen",
        email: "sarah@taskflow.com",
        password: hashedPassword,
        role: "admin",
        avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Sarah",
        bio: "Full-stack developer with a focus on React and Node.js.",
      },
    }),
    prisma.user.create({
      data: {
        name: "Alex Rivera",
        email: "alex@taskflow.com",
        password: hashedPassword,
        role: "member",
        avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Alex",
        bio: "Backend engineer specializing in APIs and microservices.",
      },
    }),
    prisma.user.create({
      data: {
        name: "Jordan Kim",
        email: "jordan@taskflow.com",
        password: hashedPassword,
        role: "member",
        avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Jordan",
        bio: "UI/UX designer creating intuitive user experiences.",
      },
    }),
    prisma.user.create({
      data: {
        name: "Maya Patel",
        email: "maya@taskflow.com",
        password: hashedPassword,
        role: "member",
        avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Maya",
        bio: "DevOps engineer focused on CI/CD and infrastructure.",
      },
    }),
    prisma.user.create({
      data: {
        name: "Chris Taylor",
        email: "chris@taskflow.com",
        password: hashedPassword,
        role: "member",
        avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Chris",
        bio: "Mobile developer building cross-platform applications.",
      },
    }),
    prisma.user.create({
      data: {
        name: "Sam Johnson",
        email: "sam@taskflow.com",
        password: hashedPassword,
        role: "viewer",
        avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Sam",
        bio: "Stakeholder and project sponsor.",
      },
    }),
    prisma.user.create({
      data: {
        name: "Emily Zhang",
        email: "emily@taskflow.com",
        password: hashedPassword,
        role: "member",
        avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Emily",
        bio: "QA engineer ensuring quality across all releases.",
      },
    }),
  ]);

  const [demo, sarah, alex, jordan, maya, chris, sam, emily] = users;

  console.log(`Created ${users.length} users`);

  // ──────────────────────────────────────────
  // Projects
  // ──────────────────────────────────────────
  const projects = await Promise.all([
    prisma.project.create({
      data: {
        name: "Website Redesign",
        description: "Complete overhaul of the company website with modern design and improved UX.",
        color: "#3b82f6",
        status: "active",
      },
    }),
    prisma.project.create({
      data: {
        name: "Mobile App v2",
        description: "Second major version of our mobile app with new features and performance improvements.",
        color: "#8b5cf6",
        status: "active",
      },
    }),
    prisma.project.create({
      data: {
        name: "API Platform",
        description: "Build a robust API platform for third-party integrations and developer tools.",
        color: "#22c55e",
        status: "active",
      },
    }),
    prisma.project.create({
      data: {
        name: "Marketing Campaign",
        description: "Q1 2026 marketing campaign across digital channels.",
        color: "#f97316",
        status: "active",
      },
    }),
    prisma.project.create({
      data: {
        name: "Data Pipeline",
        description: "Real-time data pipeline for analytics and reporting.",
        color: "#ef4444",
        status: "active",
      },
    }),
    prisma.project.create({
      data: {
        name: "Design System",
        description: "Unified design system with reusable components and design tokens.",
        color: "#14b8a6",
        status: "active",
      },
    }),
  ]);

  const [websiteRedesign, mobileApp, apiPlatform, marketingCampaign, dataPipeline, designSystem] = projects;

  console.log(`Created ${projects.length} projects`);

  // ──────────────────────────────────────────
  // Project Members
  // ──────────────────────────────────────────
  const memberEntries = [
    // Website Redesign
    { userId: demo.id, projectId: websiteRedesign.id, role: "owner" },
    { userId: sarah.id, projectId: websiteRedesign.id, role: "admin" },
    { userId: jordan.id, projectId: websiteRedesign.id, role: "member" },
    { userId: emily.id, projectId: websiteRedesign.id, role: "member" },
    // Mobile App v2
    { userId: demo.id, projectId: mobileApp.id, role: "owner" },
    { userId: chris.id, projectId: mobileApp.id, role: "admin" },
    { userId: sarah.id, projectId: mobileApp.id, role: "member" },
    { userId: alex.id, projectId: mobileApp.id, role: "member" },
    // API Platform
    { userId: alex.id, projectId: apiPlatform.id, role: "owner" },
    { userId: sarah.id, projectId: apiPlatform.id, role: "admin" },
    { userId: maya.id, projectId: apiPlatform.id, role: "member" },
    { userId: demo.id, projectId: apiPlatform.id, role: "member" },
    // Marketing Campaign
    { userId: demo.id, projectId: marketingCampaign.id, role: "owner" },
    { userId: jordan.id, projectId: marketingCampaign.id, role: "member" },
    { userId: sam.id, projectId: marketingCampaign.id, role: "viewer" },
    // Data Pipeline
    { userId: maya.id, projectId: dataPipeline.id, role: "owner" },
    { userId: alex.id, projectId: dataPipeline.id, role: "admin" },
    { userId: demo.id, projectId: dataPipeline.id, role: "member" },
    { userId: emily.id, projectId: dataPipeline.id, role: "member" },
    // Design System
    { userId: jordan.id, projectId: designSystem.id, role: "owner" },
    { userId: sarah.id, projectId: designSystem.id, role: "admin" },
    { userId: chris.id, projectId: designSystem.id, role: "member" },
    { userId: demo.id, projectId: designSystem.id, role: "member" },
  ];

  for (const entry of memberEntries) {
    await prisma.projectMember.create({ data: entry });
  }

  console.log(`Created ${memberEntries.length} project members`);

  // ──────────────────────────────────────────
  // Labels
  // ──────────────────────────────────────────
  const labels = await Promise.all([
    prisma.label.create({ data: { name: "Bug", color: "#ef4444" } }),
    prisma.label.create({ data: { name: "Feature", color: "#3b82f6" } }),
    prisma.label.create({ data: { name: "Design", color: "#8b5cf6" } }),
    prisma.label.create({ data: { name: "Backend", color: "#22c55e" } }),
    prisma.label.create({ data: { name: "Frontend", color: "#f97316" } }),
    prisma.label.create({ data: { name: "Documentation", color: "#6b7280" } }),
  ]);

  const [bugLabel, featureLabel, designLabel, backendLabel, frontendLabel, docsLabel] = labels;

  console.log(`Created ${labels.length} labels`);

  // ──────────────────────────────────────────
  // Tasks
  // ──────────────────────────────────────────
  const tasks = await Promise.all([
    // Website Redesign tasks (8)
    prisma.task.create({
      data: {
        title: "Design new homepage layout",
        description: "Create a modern, responsive homepage layout with hero section, features grid, and testimonials.",
        status: "done",
        priority: "high",
        projectId: websiteRedesign.id,
        assigneeId: jordan.id,
        creatorId: demo.id,
        dueDate: new Date("2026-03-10"),
        position: 0,
      },
    }),
    prisma.task.create({
      data: {
        title: "Implement responsive navigation",
        description: "Build a responsive navigation bar with mobile hamburger menu and dropdown submenus.",
        status: "done",
        priority: "high",
        projectId: websiteRedesign.id,
        assigneeId: sarah.id,
        creatorId: demo.id,
        dueDate: new Date("2026-03-12"),
        position: 1,
      },
    }),
    prisma.task.create({
      data: {
        title: "Build contact form with validation",
        description: "Create a contact form with client-side and server-side validation, plus email integration.",
        status: "in-review",
        priority: "medium",
        projectId: websiteRedesign.id,
        assigneeId: sarah.id,
        creatorId: demo.id,
        dueDate: new Date("2026-03-25"),
        position: 2,
      },
    }),
    prisma.task.create({
      data: {
        title: "Optimize images and assets",
        description: "Compress images, implement lazy loading, and set up CDN for static assets.",
        status: "in-progress",
        priority: "medium",
        projectId: websiteRedesign.id,
        assigneeId: emily.id,
        creatorId: sarah.id,
        dueDate: new Date("2026-03-28"),
        position: 3,
      },
    }),
    prisma.task.create({
      data: {
        title: "Set up analytics tracking",
        description: "Integrate Google Analytics 4 and set up custom event tracking for key user interactions.",
        status: "todo",
        priority: "low",
        projectId: websiteRedesign.id,
        assigneeId: emily.id,
        creatorId: demo.id,
        dueDate: new Date("2026-04-05"),
        position: 4,
      },
    }),
    prisma.task.create({
      data: {
        title: "Fix header z-index issue on mobile",
        description: "The header overlaps with modal dialogs on mobile Safari. Need to fix z-index stacking context.",
        status: "in-progress",
        priority: "urgent",
        projectId: websiteRedesign.id,
        assigneeId: sarah.id,
        creatorId: emily.id,
        dueDate: new Date("2026-03-22"),
        position: 5,
      },
    }),
    prisma.task.create({
      data: {
        title: "Create about page design",
        description: "Design the about page with team section, company history timeline, and mission statement.",
        status: "todo",
        priority: "medium",
        projectId: websiteRedesign.id,
        assigneeId: jordan.id,
        creatorId: demo.id,
        dueDate: new Date("2026-04-02"),
        position: 6,
      },
    }),
    prisma.task.create({
      data: {
        title: "Implement dark mode toggle",
        description: "Add system-preference-aware dark mode with manual toggle and persistent user preference.",
        status: "in-review",
        priority: "low",
        projectId: websiteRedesign.id,
        assigneeId: sarah.id,
        creatorId: jordan.id,
        dueDate: new Date("2026-03-30"),
        position: 7,
      },
    }),

    // Mobile App v2 tasks (6)
    prisma.task.create({
      data: {
        title: "Implement push notification system",
        description: "Set up Firebase Cloud Messaging for push notifications with topic-based subscriptions.",
        status: "in-progress",
        priority: "high",
        projectId: mobileApp.id,
        assigneeId: chris.id,
        creatorId: demo.id,
        dueDate: new Date("2026-03-26"),
        position: 0,
      },
    }),
    prisma.task.create({
      data: {
        title: "Build offline sync mechanism",
        description: "Implement local-first data storage with background sync when connection is restored.",
        status: "todo",
        priority: "urgent",
        projectId: mobileApp.id,
        assigneeId: alex.id,
        creatorId: chris.id,
        dueDate: new Date("2026-04-01"),
        position: 1,
      },
    }),
    prisma.task.create({
      data: {
        title: "Redesign user profile screen",
        description: "Update the profile screen with new layout, avatar upload, and activity feed.",
        status: "done",
        priority: "medium",
        projectId: mobileApp.id,
        assigneeId: chris.id,
        creatorId: demo.id,
        dueDate: new Date("2026-03-15"),
        position: 2,
      },
    }),
    prisma.task.create({
      data: {
        title: "Fix crash on Android 14 camera",
        description: "App crashes when opening camera on Android 14 devices due to new permission model.",
        status: "in-progress",
        priority: "urgent",
        projectId: mobileApp.id,
        assigneeId: chris.id,
        creatorId: alex.id,
        dueDate: new Date("2026-03-21"),
        position: 3,
      },
    }),
    prisma.task.create({
      data: {
        title: "Add biometric authentication",
        description: "Implement Face ID and fingerprint authentication for app login.",
        status: "todo",
        priority: "high",
        projectId: mobileApp.id,
        assigneeId: sarah.id,
        creatorId: demo.id,
        dueDate: new Date("2026-04-08"),
        position: 4,
      },
    }),
    prisma.task.create({
      data: {
        title: "Optimize app startup time",
        description: "Reduce cold start time from 3s to under 1s by lazy loading and code splitting.",
        status: "in-review",
        priority: "high",
        projectId: mobileApp.id,
        assigneeId: alex.id,
        creatorId: chris.id,
        dueDate: new Date("2026-03-29"),
        position: 5,
      },
    }),

    // API Platform tasks (5)
    prisma.task.create({
      data: {
        title: "Design REST API schema",
        description: "Define OpenAPI 3.0 schema for all platform endpoints with proper versioning.",
        status: "done",
        priority: "high",
        projectId: apiPlatform.id,
        assigneeId: alex.id,
        creatorId: alex.id,
        dueDate: new Date("2026-03-08"),
        position: 0,
      },
    }),
    prisma.task.create({
      data: {
        title: "Implement rate limiting",
        description: "Add sliding window rate limiting with configurable thresholds per API key tier.",
        status: "in-progress",
        priority: "high",
        projectId: apiPlatform.id,
        assigneeId: maya.id,
        creatorId: alex.id,
        dueDate: new Date("2026-03-27"),
        position: 1,
      },
    }),
    prisma.task.create({
      data: {
        title: "Build API key management UI",
        description: "Create a dashboard for developers to create, rotate, and revoke API keys.",
        status: "todo",
        priority: "medium",
        projectId: apiPlatform.id,
        assigneeId: sarah.id,
        creatorId: alex.id,
        dueDate: new Date("2026-04-03"),
        position: 2,
      },
    }),
    prisma.task.create({
      data: {
        title: "Set up webhook delivery system",
        description: "Implement reliable webhook delivery with retries, dead letter queue, and delivery logs.",
        status: "todo",
        priority: "high",
        projectId: apiPlatform.id,
        assigneeId: alex.id,
        creatorId: demo.id,
        dueDate: new Date("2026-04-10"),
        position: 3,
      },
    }),
    prisma.task.create({
      data: {
        title: "Write API documentation",
        description: "Complete API reference docs with examples in cURL, Python, JavaScript, and Go.",
        status: "in-progress",
        priority: "medium",
        projectId: apiPlatform.id,
        assigneeId: demo.id,
        creatorId: alex.id,
        dueDate: new Date("2026-04-05"),
        position: 4,
      },
    }),

    // Marketing Campaign tasks (4)
    prisma.task.create({
      data: {
        title: "Create social media content calendar",
        description: "Plan 30 days of social media posts across Twitter, LinkedIn, and Instagram.",
        status: "done",
        priority: "high",
        projectId: marketingCampaign.id,
        assigneeId: jordan.id,
        creatorId: demo.id,
        dueDate: new Date("2026-03-05"),
        position: 0,
      },
    }),
    prisma.task.create({
      data: {
        title: "Design email campaign templates",
        description: "Create responsive email templates for the nurture sequence and product announcements.",
        status: "in-progress",
        priority: "medium",
        projectId: marketingCampaign.id,
        assigneeId: jordan.id,
        creatorId: demo.id,
        dueDate: new Date("2026-03-28"),
        position: 1,
      },
    }),
    prisma.task.create({
      data: {
        title: "Set up A/B testing for landing pages",
        description: "Configure A/B tests for hero copy, CTA buttons, and pricing page layout.",
        status: "todo",
        priority: "medium",
        projectId: marketingCampaign.id,
        assigneeId: demo.id,
        creatorId: demo.id,
        dueDate: new Date("2026-04-02"),
        position: 2,
      },
    }),
    prisma.task.create({
      data: {
        title: "Analyze Q4 campaign performance",
        description: "Generate comprehensive report on Q4 campaign ROI, conversion rates, and channel effectiveness.",
        status: "done",
        priority: "low",
        projectId: marketingCampaign.id,
        assigneeId: demo.id,
        creatorId: sam.id,
        dueDate: new Date("2026-03-12"),
        position: 3,
      },
    }),

    // Data Pipeline tasks (5)
    prisma.task.create({
      data: {
        title: "Set up Kafka message broker",
        description: "Deploy and configure Apache Kafka cluster for real-time event streaming.",
        status: "done",
        priority: "urgent",
        projectId: dataPipeline.id,
        assigneeId: maya.id,
        creatorId: maya.id,
        dueDate: new Date("2026-03-10"),
        position: 0,
      },
    }),
    prisma.task.create({
      data: {
        title: "Build data transformation layer",
        description: "Implement ETL transforms for raw event data into analytics-ready format.",
        status: "in-progress",
        priority: "high",
        projectId: dataPipeline.id,
        assigneeId: alex.id,
        creatorId: maya.id,
        dueDate: new Date("2026-03-30"),
        position: 1,
      },
    }),
    prisma.task.create({
      data: {
        title: "Create monitoring dashboard",
        description: "Build Grafana dashboards for pipeline health, throughput, and error rates.",
        status: "todo",
        priority: "medium",
        projectId: dataPipeline.id,
        assigneeId: maya.id,
        creatorId: alex.id,
        dueDate: new Date("2026-04-05"),
        position: 2,
      },
    }),
    prisma.task.create({
      data: {
        title: "Fix data duplication in consumer",
        description: "Investigate and fix duplicate records appearing in the analytics database from Kafka consumer.",
        status: "in-review",
        priority: "urgent",
        projectId: dataPipeline.id,
        assigneeId: alex.id,
        creatorId: emily.id,
        dueDate: new Date("2026-03-23"),
        position: 3,
      },
    }),
    prisma.task.create({
      data: {
        title: "Implement data retention policies",
        description: "Set up automated data archival and deletion based on configurable retention windows.",
        status: "todo",
        priority: "low",
        projectId: dataPipeline.id,
        assigneeId: emily.id,
        creatorId: maya.id,
        dueDate: new Date("2026-04-12"),
        position: 4,
      },
    }),

    // Design System tasks (5)
    prisma.task.create({
      data: {
        title: "Define color token system",
        description: "Create semantic color tokens for light and dark themes with proper contrast ratios.",
        status: "done",
        priority: "high",
        projectId: designSystem.id,
        assigneeId: jordan.id,
        creatorId: jordan.id,
        dueDate: new Date("2026-03-08"),
        position: 0,
      },
    }),
    prisma.task.create({
      data: {
        title: "Build button component library",
        description: "Create button variants (primary, secondary, ghost, destructive) with all states and sizes.",
        status: "in-review",
        priority: "high",
        projectId: designSystem.id,
        assigneeId: sarah.id,
        creatorId: jordan.id,
        dueDate: new Date("2026-03-24"),
        position: 1,
      },
    }),
    prisma.task.create({
      data: {
        title: "Create form input components",
        description: "Build text input, select, checkbox, radio, and textarea with consistent styling and validation states.",
        status: "in-progress",
        priority: "medium",
        projectId: designSystem.id,
        assigneeId: chris.id,
        creatorId: jordan.id,
        dueDate: new Date("2026-03-31"),
        position: 2,
      },
    }),
    prisma.task.create({
      data: {
        title: "Write component documentation",
        description: "Document all components with usage examples, props tables, and accessibility guidelines.",
        status: "todo",
        priority: "medium",
        projectId: designSystem.id,
        assigneeId: demo.id,
        creatorId: jordan.id,
        dueDate: new Date("2026-04-07"),
        position: 3,
      },
    }),
    prisma.task.create({
      data: {
        title: "Set up Storybook",
        description: "Configure Storybook with addons for accessibility, viewport, and theme switching.",
        status: "todo",
        priority: "low",
        projectId: designSystem.id,
        assigneeId: sarah.id,
        creatorId: jordan.id,
        dueDate: new Date("2026-04-10"),
        position: 4,
      },
    }),
  ]);

  console.log(`Created ${tasks.length} tasks`);

  // ──────────────────────────────────────────
  // Task Labels
  // ──────────────────────────────────────────
  const taskLabelEntries = [
    { taskId: tasks[0].id, labelId: designLabel.id },
    { taskId: tasks[0].id, labelId: frontendLabel.id },
    { taskId: tasks[1].id, labelId: frontendLabel.id },
    { taskId: tasks[2].id, labelId: frontendLabel.id },
    { taskId: tasks[2].id, labelId: backendLabel.id },
    { taskId: tasks[3].id, labelId: frontendLabel.id },
    { taskId: tasks[5].id, labelId: bugLabel.id },
    { taskId: tasks[5].id, labelId: frontendLabel.id },
    { taskId: tasks[6].id, labelId: designLabel.id },
    { taskId: tasks[7].id, labelId: featureLabel.id },
    { taskId: tasks[7].id, labelId: frontendLabel.id },
    { taskId: tasks[8].id, labelId: featureLabel.id },
    { taskId: tasks[8].id, labelId: backendLabel.id },
    { taskId: tasks[9].id, labelId: featureLabel.id },
    { taskId: tasks[9].id, labelId: backendLabel.id },
    { taskId: tasks[11].id, labelId: bugLabel.id },
    { taskId: tasks[13].id, labelId: featureLabel.id },
    { taskId: tasks[14].id, labelId: backendLabel.id },
    { taskId: tasks[15].id, labelId: backendLabel.id },
    { taskId: tasks[16].id, labelId: backendLabel.id },
    { taskId: tasks[17].id, labelId: featureLabel.id },
    { taskId: tasks[19].id, labelId: docsLabel.id },
    { taskId: tasks[19].id, labelId: backendLabel.id },
    { taskId: tasks[21].id, labelId: designLabel.id },
    { taskId: tasks[22].id, labelId: featureLabel.id },
    { taskId: tasks[24].id, labelId: backendLabel.id },
    { taskId: tasks[25].id, labelId: backendLabel.id },
    { taskId: tasks[26].id, labelId: bugLabel.id },
    { taskId: tasks[26].id, labelId: backendLabel.id },
    { taskId: tasks[28].id, labelId: designLabel.id },
    { taskId: tasks[29].id, labelId: designLabel.id },
    { taskId: tasks[29].id, labelId: frontendLabel.id },
    { taskId: tasks[30].id, labelId: frontendLabel.id },
    { taskId: tasks[31].id, labelId: docsLabel.id },
    { taskId: tasks[32].id, labelId: featureLabel.id },
  ];

  for (const entry of taskLabelEntries) {
    await prisma.taskLabel.create({ data: entry });
  }

  console.log(`Created ${taskLabelEntries.length} task labels`);

  // ──────────────────────────────────────────
  // Comments
  // ──────────────────────────────────────────
  const comments = await Promise.all([
    // Comments on "Design new homepage layout"
    prisma.comment.create({
      data: {
        content: "I've uploaded the initial wireframes to Figma. Let me know your thoughts on the hero section layout.",
        taskId: tasks[0].id,
        authorId: jordan.id,
        createdAt: new Date("2026-03-05T10:30:00"),
      },
    }),
    prisma.comment.create({
      data: {
        content: "Looks great! Can we explore a version with a video background instead of the static image?",
        taskId: tasks[0].id,
        authorId: demo.id,
        createdAt: new Date("2026-03-05T14:15:00"),
      },
    }),
    prisma.comment.create({
      data: {
        content: "Video background might hurt performance on mobile. How about a subtle CSS animation instead?",
        taskId: tasks[0].id,
        authorId: sarah.id,
        createdAt: new Date("2026-03-05T15:45:00"),
      },
    }),
    // Comments on "Implement responsive navigation"
    prisma.comment.create({
      data: {
        content: "Navigation is complete. Tested on Chrome, Firefox, Safari, and Edge. All looking good.",
        taskId: tasks[1].id,
        authorId: sarah.id,
        createdAt: new Date("2026-03-11T09:00:00"),
      },
    }),
    prisma.comment.create({
      data: {
        content: "Verified on mobile devices. The hamburger animation is smooth. Approved!",
        taskId: tasks[1].id,
        authorId: emily.id,
        createdAt: new Date("2026-03-11T16:30:00"),
      },
    }),
    // Comments on "Fix header z-index issue on mobile"
    prisma.comment.create({
      data: {
        content: "I can reproduce this consistently on iPhone 15 with iOS 17. The modal backdrop appears above the header.",
        taskId: tasks[5].id,
        authorId: emily.id,
        createdAt: new Date("2026-03-20T11:00:00"),
      },
    }),
    prisma.comment.create({
      data: {
        content: "Found the issue — it's a stacking context problem caused by the transform property on the header. Working on a fix.",
        taskId: tasks[5].id,
        authorId: sarah.id,
        createdAt: new Date("2026-03-20T14:30:00"),
      },
    }),
    // Comments on "Implement push notification system"
    prisma.comment.create({
      data: {
        content: "Firebase SDK is integrated. Working on the topic subscription logic now.",
        taskId: tasks[8].id,
        authorId: chris.id,
        createdAt: new Date("2026-03-22T10:00:00"),
      },
    }),
    prisma.comment.create({
      data: {
        content: "Don't forget to handle notification permissions gracefully on iOS. Users need clear context for why they should enable them.",
        taskId: tasks[8].id,
        authorId: demo.id,
        createdAt: new Date("2026-03-22T11:30:00"),
      },
    }),
    // Comments on "Fix crash on Android 14 camera"
    prisma.comment.create({
      data: {
        content: "This is a known issue with the new photo picker API on Android 14. We need to migrate from the old Intent-based approach.",
        taskId: tasks[11].id,
        authorId: alex.id,
        createdAt: new Date("2026-03-19T09:15:00"),
      },
    }),
    prisma.comment.create({
      data: {
        content: "I've started the migration. Testing on Pixel 8 and Samsung S24. Will update when the fix is ready.",
        taskId: tasks[11].id,
        authorId: chris.id,
        createdAt: new Date("2026-03-19T14:00:00"),
      },
    }),
    // Comments on "Implement rate limiting"
    prisma.comment.create({
      data: {
        content: "Going with a Redis-based sliding window approach. Should handle 10k requests/second comfortably.",
        taskId: tasks[16].id,
        authorId: maya.id,
        createdAt: new Date("2026-03-24T10:00:00"),
      },
    }),
    prisma.comment.create({
      data: {
        content: "Make sure to include rate limit headers in the response (X-RateLimit-Limit, X-RateLimit-Remaining, X-RateLimit-Reset).",
        taskId: tasks[16].id,
        authorId: alex.id,
        createdAt: new Date("2026-03-24T11:45:00"),
      },
    }),
    // Comments on "Build data transformation layer"
    prisma.comment.create({
      data: {
        content: "Schema validation is done. Now working on the transformation pipeline for user events.",
        taskId: tasks[25].id,
        authorId: alex.id,
        createdAt: new Date("2026-03-26T09:30:00"),
      },
    }),
    prisma.comment.create({
      data: {
        content: "Consider using Apache Avro for schema evolution. It'll make backwards compatibility much easier.",
        taskId: tasks[25].id,
        authorId: maya.id,
        createdAt: new Date("2026-03-26T10:15:00"),
      },
    }),
    // Comments on "Fix data duplication in consumer"
    prisma.comment.create({
      data: {
        content: "The duplication is caused by the consumer committing offsets after processing but before deduplication. We need exactly-once semantics.",
        taskId: tasks[26].id,
        authorId: alex.id,
        createdAt: new Date("2026-03-22T15:00:00"),
      },
    }),
    prisma.comment.create({
      data: {
        content: "Good catch. Let's implement idempotent writes using a composite key of event_id + timestamp.",
        taskId: tasks[26].id,
        authorId: maya.id,
        createdAt: new Date("2026-03-22T16:30:00"),
      },
    }),
    // Comments on "Build button component library"
    prisma.comment.create({
      data: {
        content: "All button variants are implemented. Check the Storybook preview: primary, secondary, ghost, destructive, outline, and link styles.",
        taskId: tasks[29].id,
        authorId: sarah.id,
        createdAt: new Date("2026-03-22T14:00:00"),
      },
    }),
    prisma.comment.create({
      data: {
        content: "They look fantastic! Just need to bump up the focus ring contrast for accessibility compliance.",
        taskId: tasks[29].id,
        authorId: jordan.id,
        createdAt: new Date("2026-03-22T15:30:00"),
      },
    }),
    // Comments on "Create form input components"
    prisma.comment.create({
      data: {
        content: "Text input and select are done. Working on checkbox and radio now. Using Radix primitives under the hood.",
        taskId: tasks[30].id,
        authorId: chris.id,
        createdAt: new Date("2026-03-28T10:00:00"),
      },
    }),
    prisma.comment.create({
      data: {
        content: "Make sure the error states are visually distinct. Use a red border plus an error message below the input.",
        taskId: tasks[30].id,
        authorId: jordan.id,
        createdAt: new Date("2026-03-28T11:30:00"),
      },
    }),
    // Comments on "Optimize app startup time"
    prisma.comment.create({
      data: {
        content: "Profiling shows that 60% of startup time is spent loading the analytics SDK. We should defer it.",
        taskId: tasks[13].id,
        authorId: alex.id,
        createdAt: new Date("2026-03-27T09:00:00"),
      },
    }),
  ]);

  console.log(`Created ${comments.length} comments`);

  // ──────────────────────────────────────────
  // Documents
  // ──────────────────────────────────────────
  const documents = await Promise.all([
    prisma.document.create({
      data: {
        title: "Website Redesign - Project Brief",
        content: "# Project Brief\n\n## Objective\nRedesign the company website to improve user experience, increase conversion rates, and modernize the visual identity.\n\n## Scope\n- Homepage redesign\n- Navigation restructure\n- Contact and about pages\n- Blog template\n- Performance optimization\n\n## Timeline\nMarch 1 - April 15, 2026\n\n## Success Metrics\n- 20% improvement in bounce rate\n- 15% increase in contact form submissions\n- Lighthouse score > 90 on all pages",
        projectId: websiteRedesign.id,
        authorId: demo.id,
      },
    }),
    prisma.document.create({
      data: {
        title: "Website Style Guide",
        content: "# Style Guide\n\n## Typography\n- Headings: Inter, bold\n- Body: Inter, regular\n- Code: JetBrains Mono\n\n## Colors\n- Primary: #3b82f6\n- Secondary: #6366f1\n- Success: #22c55e\n- Warning: #f97316\n- Error: #ef4444\n\n## Spacing\n- Base unit: 4px\n- Section padding: 64px\n- Component gap: 16px",
        projectId: websiteRedesign.id,
        authorId: jordan.id,
      },
    }),
    prisma.document.create({
      data: {
        title: "Mobile App v2 - Technical Spec",
        content: "# Mobile App v2 Technical Specification\n\n## Architecture\n- React Native 0.73\n- TypeScript\n- Zustand for state management\n- React Query for data fetching\n\n## New Features\n1. Push notifications (FCM)\n2. Offline-first sync\n3. Biometric auth\n4. Redesigned profile\n\n## Performance Targets\n- Cold start: < 1s\n- API response rendering: < 200ms\n- Bundle size: < 15MB",
        projectId: mobileApp.id,
        authorId: chris.id,
      },
    }),
    prisma.document.create({
      data: {
        title: "API Platform - Architecture Decision Record",
        content: "# ADR: API Platform Architecture\n\n## Context\nWe need a scalable API platform for third-party integrations.\n\n## Decision\n- REST API with OpenAPI 3.0\n- API gateway: Kong\n- Rate limiting: Redis sliding window\n- Auth: OAuth 2.0 + API keys\n- Webhooks: async delivery with retries\n\n## Consequences\n- Higher initial setup complexity\n- Better scalability and developer experience\n- Easier monitoring and observability",
        projectId: apiPlatform.id,
        authorId: alex.id,
      },
    }),
    prisma.document.create({
      data: {
        title: "API Endpoint Reference",
        content: "# API Reference\n\n## Authentication\nAll requests require an API key in the `X-API-Key` header.\n\n## Endpoints\n\n### Users\n- `GET /api/v1/users` - List users\n- `GET /api/v1/users/:id` - Get user\n- `POST /api/v1/users` - Create user\n\n### Projects\n- `GET /api/v1/projects` - List projects\n- `POST /api/v1/projects` - Create project\n\n## Rate Limits\n- Free tier: 100 req/min\n- Pro tier: 1000 req/min\n- Enterprise: Custom",
        projectId: apiPlatform.id,
        authorId: demo.id,
      },
    }),
    prisma.document.create({
      data: {
        title: "Marketing Campaign - Content Strategy",
        content: "# Q1 2026 Content Strategy\n\n## Channels\n1. **Twitter/X**: 3 posts/day (product tips, team highlights, industry news)\n2. **LinkedIn**: 5 posts/week (thought leadership, case studies)\n3. **Email**: Weekly newsletter + bi-weekly product updates\n4. **Blog**: 2 articles/week\n\n## Key Themes\n- Product-led growth\n- Developer experience\n- Remote team collaboration\n\n## Budget\nTotal: $25,000\n- Paid social: $10,000\n- Content creation: $8,000\n- Tools and software: $4,000\n- Contingency: $3,000",
        projectId: marketingCampaign.id,
        authorId: demo.id,
      },
    }),
    prisma.document.create({
      data: {
        title: "Data Pipeline - Infrastructure Runbook",
        content: "# Data Pipeline Runbook\n\n## Services\n- Kafka cluster: 3 brokers\n- Schema Registry: confluent\n- Consumer group: analytics-consumers\n- Database: PostgreSQL 16\n\n## Monitoring\n- Grafana dashboards: /d/pipeline-health\n- Alerts: PagerDuty integration\n- Log aggregation: Loki\n\n## Incident Response\n1. Check Grafana for pipeline lag\n2. Verify Kafka broker health\n3. Check consumer group status\n4. Review error logs in Loki",
        projectId: dataPipeline.id,
        authorId: maya.id,
      },
    }),
    prisma.document.create({
      data: {
        title: "Design System - Component Guidelines",
        content: "# Component Guidelines\n\n## Principles\n1. **Consistency**: All components follow the same patterns\n2. **Accessibility**: WCAG 2.1 AA compliance minimum\n3. **Composability**: Components should be easily combined\n4. **Performance**: No unnecessary re-renders\n\n## Component Structure\n```\nComponentName/\n  index.tsx          - Main component\n  ComponentName.styles.ts - Styles\n  ComponentName.test.tsx  - Tests\n  ComponentName.stories.tsx - Storybook\n```\n\n## Naming Conventions\n- Components: PascalCase\n- Props: camelCase\n- CSS tokens: kebab-case",
        projectId: designSystem.id,
        authorId: jordan.id,
      },
    }),
  ]);

  console.log(`Created ${documents.length} documents`);

  // ──────────────────────────────────────────
  // Activities
  // ──────────────────────────────────────────
  const activities = await Promise.all([
    prisma.activity.create({
      data: {
        type: "project_created",
        message: "created project Website Redesign",
        userId: demo.id,
        projectId: websiteRedesign.id,
        createdAt: new Date("2026-03-01T09:00:00"),
      },
    }),
    prisma.activity.create({
      data: {
        type: "project_created",
        message: "created project Mobile App v2",
        userId: demo.id,
        projectId: mobileApp.id,
        createdAt: new Date("2026-03-01T09:15:00"),
      },
    }),
    prisma.activity.create({
      data: {
        type: "project_created",
        message: "created project API Platform",
        userId: alex.id,
        projectId: apiPlatform.id,
        createdAt: new Date("2026-03-01T10:00:00"),
      },
    }),
    prisma.activity.create({
      data: {
        type: "task_created",
        message: "created task Design new homepage layout",
        userId: demo.id,
        projectId: websiteRedesign.id,
        createdAt: new Date("2026-03-02T10:00:00"),
      },
    }),
    prisma.activity.create({
      data: {
        type: "task_assigned",
        message: "assigned Design new homepage layout to Jordan Kim",
        userId: demo.id,
        projectId: websiteRedesign.id,
        createdAt: new Date("2026-03-02T10:05:00"),
      },
    }),
    prisma.activity.create({
      data: {
        type: "task_completed",
        message: "completed task Design new homepage layout",
        userId: jordan.id,
        projectId: websiteRedesign.id,
        createdAt: new Date("2026-03-10T16:00:00"),
      },
    }),
    prisma.activity.create({
      data: {
        type: "task_completed",
        message: "completed task Implement responsive navigation",
        userId: sarah.id,
        projectId: websiteRedesign.id,
        createdAt: new Date("2026-03-12T14:00:00"),
      },
    }),
    prisma.activity.create({
      data: {
        type: "comment_added",
        message: "commented on Design new homepage layout",
        userId: jordan.id,
        projectId: websiteRedesign.id,
        createdAt: new Date("2026-03-05T10:30:00"),
      },
    }),
    prisma.activity.create({
      data: {
        type: "member_added",
        message: "added Emily Zhang to Website Redesign",
        userId: demo.id,
        projectId: websiteRedesign.id,
        createdAt: new Date("2026-03-03T09:00:00"),
      },
    }),
    prisma.activity.create({
      data: {
        type: "task_created",
        message: "created task Implement push notification system",
        userId: demo.id,
        projectId: mobileApp.id,
        createdAt: new Date("2026-03-05T11:00:00"),
      },
    }),
    prisma.activity.create({
      data: {
        type: "task_status_changed",
        message: "moved Fix crash on Android 14 camera to in-progress",
        userId: chris.id,
        projectId: mobileApp.id,
        createdAt: new Date("2026-03-18T09:00:00"),
      },
    }),
    prisma.activity.create({
      data: {
        type: "task_completed",
        message: "completed task Redesign user profile screen",
        userId: chris.id,
        projectId: mobileApp.id,
        createdAt: new Date("2026-03-15T17:00:00"),
      },
    }),
    prisma.activity.create({
      data: {
        type: "document_created",
        message: "created document API Platform - Architecture Decision Record",
        userId: alex.id,
        projectId: apiPlatform.id,
        createdAt: new Date("2026-03-04T10:00:00"),
      },
    }),
    prisma.activity.create({
      data: {
        type: "task_completed",
        message: "completed task Design REST API schema",
        userId: alex.id,
        projectId: apiPlatform.id,
        createdAt: new Date("2026-03-08T15:00:00"),
      },
    }),
    prisma.activity.create({
      data: {
        type: "task_status_changed",
        message: "moved Implement rate limiting to in-progress",
        userId: maya.id,
        projectId: apiPlatform.id,
        createdAt: new Date("2026-03-20T09:00:00"),
      },
    }),
    prisma.activity.create({
      data: {
        type: "task_completed",
        message: "completed task Create social media content calendar",
        userId: jordan.id,
        projectId: marketingCampaign.id,
        createdAt: new Date("2026-03-05T16:00:00"),
      },
    }),
    prisma.activity.create({
      data: {
        type: "task_completed",
        message: "completed task Set up Kafka message broker",
        userId: maya.id,
        projectId: dataPipeline.id,
        createdAt: new Date("2026-03-10T18:00:00"),
      },
    }),
    prisma.activity.create({
      data: {
        type: "task_status_changed",
        message: "moved Build data transformation layer to in-progress",
        userId: alex.id,
        projectId: dataPipeline.id,
        createdAt: new Date("2026-03-15T09:00:00"),
      },
    }),
    prisma.activity.create({
      data: {
        type: "comment_added",
        message: "commented on Fix data duplication in consumer",
        userId: maya.id,
        projectId: dataPipeline.id,
        createdAt: new Date("2026-03-22T16:30:00"),
      },
    }),
    prisma.activity.create({
      data: {
        type: "task_completed",
        message: "completed task Define color token system",
        userId: jordan.id,
        projectId: designSystem.id,
        createdAt: new Date("2026-03-08T14:00:00"),
      },
    }),
    prisma.activity.create({
      data: {
        type: "task_status_changed",
        message: "moved Build button component library to in-review",
        userId: sarah.id,
        projectId: designSystem.id,
        createdAt: new Date("2026-03-22T13:00:00"),
      },
    }),
    prisma.activity.create({
      data: {
        type: "document_created",
        message: "created document Design System - Component Guidelines",
        userId: jordan.id,
        projectId: designSystem.id,
        createdAt: new Date("2026-03-06T10:00:00"),
      },
    }),
    prisma.activity.create({
      data: {
        type: "project_created",
        message: "created project Marketing Campaign",
        userId: demo.id,
        projectId: marketingCampaign.id,
        createdAt: new Date("2026-03-01T11:00:00"),
      },
    }),
    prisma.activity.create({
      data: {
        type: "project_created",
        message: "created project Data Pipeline",
        userId: maya.id,
        projectId: dataPipeline.id,
        createdAt: new Date("2026-03-01T11:30:00"),
      },
    }),
    prisma.activity.create({
      data: {
        type: "project_created",
        message: "created project Design System",
        userId: jordan.id,
        projectId: designSystem.id,
        createdAt: new Date("2026-03-01T12:00:00"),
      },
    }),
    prisma.activity.create({
      data: {
        type: "task_status_changed",
        message: "moved Build contact form with validation to in-review",
        userId: sarah.id,
        projectId: websiteRedesign.id,
        createdAt: new Date("2026-03-23T11:00:00"),
      },
    }),
    prisma.activity.create({
      data: {
        type: "task_status_changed",
        message: "moved Optimize images and assets to in-progress",
        userId: emily.id,
        projectId: websiteRedesign.id,
        createdAt: new Date("2026-03-24T09:00:00"),
      },
    }),
    prisma.activity.create({
      data: {
        type: "comment_added",
        message: "commented on Implement rate limiting",
        userId: alex.id,
        projectId: apiPlatform.id,
        createdAt: new Date("2026-03-24T11:45:00"),
      },
    }),
    prisma.activity.create({
      data: {
        type: "task_status_changed",
        message: "moved Optimize app startup time to in-review",
        userId: alex.id,
        projectId: mobileApp.id,
        createdAt: new Date("2026-03-28T10:00:00"),
      },
    }),
    prisma.activity.create({
      data: {
        type: "document_created",
        message: "created document Website Redesign - Project Brief",
        userId: demo.id,
        projectId: websiteRedesign.id,
        createdAt: new Date("2026-03-01T09:30:00"),
      },
    }),
    prisma.activity.create({
      data: {
        type: "task_assigned",
        message: "assigned Fix crash on Android 14 camera to Chris Taylor",
        userId: alex.id,
        projectId: mobileApp.id,
        createdAt: new Date("2026-03-17T10:00:00"),
      },
    }),
    prisma.activity.create({
      data: {
        type: "comment_added",
        message: "commented on Build button component library",
        userId: jordan.id,
        projectId: designSystem.id,
        createdAt: new Date("2026-03-22T15:30:00"),
      },
    }),
  ]);

  console.log(`Created ${activities.length} activities`);

  // ──────────────────────────────────────────
  // Notifications (for Demo User)
  // ──────────────────────────────────────────
  const notifications = await Promise.all([
    prisma.notification.create({
      data: {
        type: "task_assigned",
        title: "New task assigned",
        message: "You have been assigned to Write API documentation in API Platform.",
        userId: demo.id,
        read: false,
        createdAt: new Date("2026-03-30T09:00:00"),
      },
    }),
    prisma.notification.create({
      data: {
        type: "comment_added",
        title: "New comment",
        message: "Sarah Chen commented on Build contact form with validation.",
        userId: demo.id,
        read: false,
        createdAt: new Date("2026-03-29T16:30:00"),
      },
    }),
    prisma.notification.create({
      data: {
        type: "task_completed",
        title: "Task completed",
        message: "Jordan Kim completed Design new homepage layout in Website Redesign.",
        userId: demo.id,
        read: false,
        createdAt: new Date("2026-03-29T14:00:00"),
      },
    }),
    prisma.notification.create({
      data: {
        type: "task_overdue",
        title: "Task overdue",
        message: "Fix header z-index issue on mobile is past its due date.",
        userId: demo.id,
        read: false,
        createdAt: new Date("2026-03-29T08:00:00"),
      },
    }),
    prisma.notification.create({
      data: {
        type: "task_status_changed",
        title: "Task status updated",
        message: "Optimize app startup time has been moved to in-review.",
        userId: demo.id,
        read: false,
        createdAt: new Date("2026-03-28T10:00:00"),
      },
    }),
    prisma.notification.create({
      data: {
        type: "comment_added",
        title: "New comment",
        message: "Chris Taylor commented on Implement push notification system.",
        userId: demo.id,
        read: true,
        createdAt: new Date("2026-03-27T11:00:00"),
      },
    }),
    prisma.notification.create({
      data: {
        type: "member_added",
        title: "New team member",
        message: "Maya Patel joined API Platform.",
        userId: demo.id,
        read: true,
        createdAt: new Date("2026-03-26T09:00:00"),
      },
    }),
    prisma.notification.create({
      data: {
        type: "task_completed",
        title: "Task completed",
        message: "Alex Rivera completed Design REST API schema in API Platform.",
        userId: demo.id,
        read: true,
        createdAt: new Date("2026-03-25T15:00:00"),
      },
    }),
    prisma.notification.create({
      data: {
        type: "document_created",
        title: "New document",
        message: "Alex Rivera created API Platform - Architecture Decision Record.",
        userId: demo.id,
        read: true,
        createdAt: new Date("2026-03-24T10:00:00"),
      },
    }),
    prisma.notification.create({
      data: {
        type: "task_assigned",
        title: "New task assigned",
        message: "You have been assigned to Set up A/B testing for landing pages.",
        userId: demo.id,
        read: true,
        createdAt: new Date("2026-03-23T14:00:00"),
      },
    }),
    prisma.notification.create({
      data: {
        type: "comment_added",
        title: "New comment",
        message: "Emily Zhang commented on Implement responsive navigation.",
        userId: demo.id,
        read: true,
        createdAt: new Date("2026-03-22T16:30:00"),
      },
    }),
    prisma.notification.create({
      data: {
        type: "task_completed",
        title: "Task completed",
        message: "Chris Taylor completed Redesign user profile screen in Mobile App v2.",
        userId: demo.id,
        read: true,
        createdAt: new Date("2026-03-21T17:00:00"),
      },
    }),
    prisma.notification.create({
      data: {
        type: "task_overdue",
        title: "Task approaching deadline",
        message: "Build contact form with validation is due in 2 days.",
        userId: demo.id,
        read: true,
        createdAt: new Date("2026-03-20T08:00:00"),
      },
    }),
    prisma.notification.create({
      data: {
        type: "project_updated",
        title: "Project updated",
        message: "Marketing Campaign project description was updated.",
        userId: demo.id,
        read: true,
        createdAt: new Date("2026-03-19T11:00:00"),
      },
    }),
    prisma.notification.create({
      data: {
        type: "comment_added",
        title: "New comment",
        message: "Jordan Kim commented on Design new homepage layout.",
        userId: demo.id,
        read: true,
        createdAt: new Date("2026-03-18T10:30:00"),
      },
    }),
    prisma.notification.create({
      data: {
        type: "task_status_changed",
        title: "Task status updated",
        message: "Fix data duplication in consumer moved to in-review.",
        userId: demo.id,
        read: true,
        createdAt: new Date("2026-03-17T14:00:00"),
      },
    }),
  ]);

  console.log(`Created ${notifications.length} notifications`);

  // ──────────────────────────────────────────
  // Calendar Events (March 2026)
  // ──────────────────────────────────────────
  const calendarEvents = await Promise.all([
    prisma.calendarEvent.create({
      data: {
        title: "Sprint Planning - Website Redesign",
        description: "Bi-weekly sprint planning for the website redesign project.",
        startDate: new Date("2026-03-02T09:00:00"),
        endDate: new Date("2026-03-02T10:30:00"),
        color: "#3b82f6",
        allDay: false,
      },
    }),
    prisma.calendarEvent.create({
      data: {
        title: "Design Review",
        description: "Review latest design mockups for the homepage and about page.",
        startDate: new Date("2026-03-05T14:00:00"),
        endDate: new Date("2026-03-05T15:00:00"),
        color: "#8b5cf6",
        allDay: false,
      },
    }),
    prisma.calendarEvent.create({
      data: {
        title: "Mobile App v2 - Standup",
        description: "Daily standup for mobile app team.",
        startDate: new Date("2026-03-10T09:30:00"),
        endDate: new Date("2026-03-10T09:45:00"),
        color: "#8b5cf6",
        allDay: false,
      },
    }),
    prisma.calendarEvent.create({
      data: {
        title: "API Platform Architecture Review",
        description: "Deep dive into the API platform architecture decisions and tech stack.",
        startDate: new Date("2026-03-12T13:00:00"),
        endDate: new Date("2026-03-12T14:30:00"),
        color: "#22c55e",
        allDay: false,
      },
    }),
    prisma.calendarEvent.create({
      data: {
        title: "Sprint Retrospective",
        description: "Team retrospective for Sprint 4. What went well, what to improve.",
        startDate: new Date("2026-03-14T15:00:00"),
        endDate: new Date("2026-03-14T16:00:00"),
        color: "#6366f1",
        allDay: false,
      },
    }),
    prisma.calendarEvent.create({
      data: {
        title: "Marketing Campaign Kickoff",
        description: "Kickoff meeting for Q1 marketing campaign. Review strategy and assign owners.",
        startDate: new Date("2026-03-16T10:00:00"),
        endDate: new Date("2026-03-16T11:30:00"),
        color: "#f97316",
        allDay: false,
      },
    }),
    prisma.calendarEvent.create({
      data: {
        title: "Sprint Planning - Sprint 5",
        description: "Plan work items for the next two-week sprint across all active projects.",
        startDate: new Date("2026-03-16T09:00:00"),
        endDate: new Date("2026-03-16T10:00:00"),
        color: "#3b82f6",
        allDay: false,
      },
    }),
    prisma.calendarEvent.create({
      data: {
        title: "Data Pipeline Demo",
        description: "Demo of the real-time data pipeline to stakeholders. Show Kafka setup and initial transforms.",
        startDate: new Date("2026-03-19T14:00:00"),
        endDate: new Date("2026-03-19T15:00:00"),
        color: "#ef4444",
        allDay: false,
      },
    }),
    prisma.calendarEvent.create({
      data: {
        title: "Design System Workshop",
        description: "Half-day workshop to align on design tokens, component API patterns, and accessibility standards.",
        startDate: new Date("2026-03-20T09:00:00"),
        endDate: new Date("2026-03-20T12:00:00"),
        color: "#14b8a6",
        allDay: false,
      },
    }),
    prisma.calendarEvent.create({
      data: {
        title: "Company All-Hands",
        description: "Monthly all-hands meeting. Product updates, team achievements, and Q&A.",
        startDate: new Date("2026-03-25T11:00:00"),
        endDate: new Date("2026-03-25T12:00:00"),
        color: "#6366f1",
        allDay: false,
      },
    }),
    prisma.calendarEvent.create({
      data: {
        title: "Website Redesign - Code Freeze",
        description: "Code freeze for the website redesign v1 launch. No new features after this date.",
        startDate: new Date("2026-03-28T00:00:00"),
        endDate: new Date("2026-03-28T23:59:00"),
        color: "#3b82f6",
        allDay: true,
      },
    }),
    prisma.calendarEvent.create({
      data: {
        title: "End of Q1 Review",
        description: "Review all project progress and KPIs for Q1 2026.",
        startDate: new Date("2026-03-31T14:00:00"),
        endDate: new Date("2026-03-31T16:00:00"),
        color: "#f97316",
        allDay: false,
      },
    }),
  ]);

  console.log(`Created ${calendarEvents.length} calendar events`);

  console.log("\nSeeding complete!");
  console.log("──────────────────────────────────────");
  console.log(`Users:           ${users.length}`);
  console.log(`Projects:        ${projects.length}`);
  console.log(`Project Members: ${memberEntries.length}`);
  console.log(`Labels:          ${labels.length}`);
  console.log(`Tasks:           ${tasks.length}`);
  console.log(`Task Labels:     ${taskLabelEntries.length}`);
  console.log(`Comments:        ${comments.length}`);
  console.log(`Documents:       ${documents.length}`);
  console.log(`Activities:      ${activities.length}`);
  console.log(`Notifications:   ${notifications.length}`);
  console.log(`Calendar Events: ${calendarEvents.length}`);
  console.log("──────────────────────────────────────");
}

main()
  .then(async () => {
    await prisma.$disconnect();
  })
  .catch(async (e) => {
    console.error("Seed error:", e);
    await prisma.$disconnect();
    process.exit(1);
  });
