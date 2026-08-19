import { Course } from '../types';

export const mockCourses: Course[] = [
  {
    id: "COURSE001",
    title: "AWS Cloud Fundamentals",
    description: "Learn the core concepts of cloud computing and how to build secure, reliable infrastructure using Amazon Web Services (AWS). This course covers AWS core services (EC2, S3, RDS), IAM security policies, serverless architectures with Lambda, and deployment strategies.",
    category: "Cloud Computing",
    skill: "AWS",
    instructor: "Jane Doe (Principal Cloud Architect)",
    duration: "6 Hours 30 Minutes",
    status: "not_started",
    createdAt: "2026-01-10",
    modules: [
      {
        id: "MOD001_1",
        title: "Module 1: Introduction to Cloud & AWS Basics",
        description: "Understand cloud deployment models, the AWS Global Infrastructure, and the AWS Console interface.",
        readingContent: "Cloud computing is the on-demand delivery of IT resources over the Internet with pay-as-you-go pricing. Instead of buying, owning, and maintaining physical data centers, you can access technology services, such as computing power, storage, and databases. AWS regions are physical geographic locations around the world where AWS clusters data centers. Each Region consists of multiple, isolated Availability Zones (AZs) that are connected with low-latency, high-throughput, and redundant networking.",
        videoUrl: "https://www.w3schools.com/html/mov_bbb.mp4",
        duration: "45 mins"
      },
      {
        id: "MOD001_2",
        title: "Module 2: Core Infrastructure Services (EC2, S3, RDS)",
        description: "Deploy virtual servers with EC2, store static objects in S3, and initialize relational database instances with RDS.",
        readingContent: "Amazon Elastic Compute Cloud (EC2) provides resizable computing capacity. You can use it to launch as many virtual servers as you need, configure security, and manage storage. Amazon Simple Storage Service (S3) is object storage built to retrieve any amount of data from anywhere. It stores data as objects within buckets. Amazon Relational Database Service (RDS) makes it easy to set up, operate, and scale relational databases in the cloud, supporting engines like PostgreSQL, MySQL, and Aurora.",
        videoUrl: "https://www.w3schools.com/html/mov_bbb.mp4",
        duration: "1 hour 30 mins"
      },
      {
        id: "MOD001_3",
        title: "Module 3: AWS Security & Identity (IAM)",
        description: "Configure Identity and Access Management users, groups, and granular custom JSON permission policies.",
        readingContent: "AWS Identity and Access Management (IAM) helps you securely control access to AWS resources. You use IAM to control who is authenticated (signed in) and authorized (has permissions) to use resources. IAM is a global service, meaning IAM users, groups, roles, and policies are valid across all AWS regions. Always follow the principle of least privilege, granting only the permissions required to perform a specific task.",
        videoUrl: "https://www.w3schools.com/html/mov_bbb.mp4",
        duration: "1 hour 15 mins"
      },
      {
        id: "MOD001_4",
        title: "Module 4: AWS Serverless & Cloud Assessment Prep",
        description: "Understand AWS Lambda, API Gateway, and review key architectures before taking the certification quiz.",
        readingContent: "Serverless allows you to build and run applications and services without thinking about servers. AWS handles the provisioning, scaling, and management of the underlying server infrastructure. AWS Lambda is an event-driven serverless computing service that executes code in response to events. Amazon API Gateway is a fully managed service that makes it easy for developers to create, publish, maintain, and secure APIs at any scale.",
        videoUrl: "https://www.w3schools.com/html/mov_bbb.mp4",
        duration: "2 hours"
      }
    ]
  },
  {
    id: "COURSE002",
    title: "Java Backend Development",
    description: "Master backend services using Java and Spring Boot. Learn object-oriented design patterns, RESTful APIs, Spring Security authentication, Hibernate JPA database mapping, and PostgreSQL data persistence.",
    category: "Software Engineering",
    skill: "Java",
    instructor: "John Smith (Senior Software Architect)",
    duration: "12 Hours 00 Minutes",
    status: "not_started",
    createdAt: "2026-02-15",
    modules: [
      {
        id: "MOD002_1",
        title: "Module 1: Advanced Java Concepts & OOP Refresher",
        description: "Delve into generic programming, streams, lambda expressions, and memory management in Java.",
        readingContent: "Java is a class-based, object-oriented programming language designed to have as few implementation dependencies as possible. Java Streams, introduced in Java 8, provide a declarative way to process collections of data. Generics enable types (classes and interfaces) to be parameters when defining classes, interfaces, and methods. Memory management is handled automatically by the Garbage Collector, which reclaims memory allocated to objects that are no longer referenced.",
        videoUrl: "https://www.w3schools.com/html/mov_bbb.mp4",
        duration: "2 hours"
      },
      {
        id: "MOD002_2",
        title: "Module 2: Building REST APIs with Spring Boot",
        description: "Initialize Spring projects, build MVC controllers, configure dependency injection, and validate endpoints.",
        readingContent: "Spring Boot makes it easy to create stand-alone, production-grade Spring-based applications. It configures Spring and 3rd party libraries automatically. A RESTful controller is annotated with @RestController and exposes HTTP endpoints. We use dependency injection (@Autowired or constructor injection) to manage component wiring, keeping controllers decoupled from services and repositories.",
        videoUrl: "https://www.w3schools.com/html/mov_bbb.mp4",
        duration: "3 hours"
      },
      {
        id: "MOD002_3",
        title: "Module 3: Database Integration with Hibernate & JPA",
        description: "Configure data sources, map entities, set up relations (One-to-Many, Many-to-Many), and execute JPQL queries.",
        readingContent: "Hibernate is an Object-Relational Mapping (ORM) framework that maps Java classes to database tables. Java Persistence API (JPA) is a specification for ORM. Spring Data JPA adds repository support, reducing boilerplate CRUD queries to interface definitions. We use entities (@Entity) and primary keys (@Id) to sync class states directly with relational database rows.",
        videoUrl: "https://www.w3schools.com/html/mov_bbb.mp4",
        duration: "3 hours"
      },
      {
        id: "MOD002_4",
        title: "Module 4: Security, Testing & API Deployment",
        description: "Secure endpoints with Spring Security JWT, implement JUnit tests, and compile JAR files for production docker containers.",
        readingContent: "Spring Security secures REST endpoints using authentication filters. JSON Web Tokens (JWT) are self-contained tokens containing user details and authorization roles, verified cryptographically. JUnit 5 and Mockito are used to write unit and integration tests to verify application state. Spring Boot packages applications as fat executable JARs containing embedded servers (Tomcat), ready for containerized deployment.",
        videoUrl: "https://www.w3schools.com/html/mov_bbb.mp4",
        duration: "4 hours"
      }
    ]
  },
  {
    id: "COURSE003",
    title: "Python for Data Analytics",
    description: "Harness the power of Python to analyze data, extract insights, and present visual patterns. Learn key analytical modules: NumPy for matrix maths, Pandas for dataframes, Matplotlib for charts, and Scikit-Learn for statistical regression models.",
    category: "Data Science",
    skill: "Python",
    instructor: "Sarah Lee (Lead Data Scientist)",
    duration: "8 Hours 00 Minutes",
    status: "not_started",
    createdAt: "2026-03-01",
    modules: [
      {
        id: "MOD003_1",
        title: "Module 1: Python Data Structures & NumPy basics",
        description: "Explore lists, dicts, list comprehensions, and basic matrix operations using NumPy arrays.",
        readingContent: "Python is an interpreted, high-level, general-purpose programming language. NumPy (Numerical Python) is a library adding support for large, multi-dimensional arrays and matrices, along with a collection of high-level mathematical functions to operate on these arrays. List comprehensions offer a concise way to create lists, providing syntax that is cleaner and faster than traditional loops.",
        videoUrl: "https://www.w3schools.com/html/mov_bbb.mp4",
        duration: "1 hour 30 mins"
      },
      {
        id: "MOD003_2",
        title: "Module 2: Structured Data Manipulation with Pandas",
        description: "Load CSV files into Pandas DataFrames, clean dirty data, filter rows, aggregate groups, and join tables.",
        readingContent: "Pandas is a software library written for the Python programming language for data manipulation and analysis. It offers data structures and operations for manipulating numerical tables and time series. The key structure is the DataFrame, which represents tabular data with labeled rows and columns. Use .groupby() to perform aggregations (mean, sum) and .merge() to perform SQL-like joins.",
        videoUrl: "https://www.w3schools.com/html/mov_bbb.mp4",
        duration: "2 hours 30 mins"
      },
      {
        id: "MOD003_3",
        title: "Module 3: Data Visualization (Matplotlib & Seaborn)",
        description: "Build bar charts, line plots, histograms, scatter plots, and customize titles, legends, and grid styles.",
        readingContent: "Matplotlib is a plotting library for the Python programming language and its numerical mathematics extension NumPy. Seaborn is a Python data visualization library based on matplotlib, providing a high-level interface for drawing attractive statistical graphics. Data visualization is critical to communicate findings, identify outliers, and check variables relationships.",
        videoUrl: "https://www.w3schools.com/html/mov_bbb.mp4",
        duration: "2 hours"
      },
      {
        id: "MOD003_4",
        title: "Module 4: Introductory Statistical Modeling & Regression",
        description: "Understand correlation, linear regression, split training and testing data, and compute model metrics.",
        readingContent: "Statistical modeling involves building models to represent relationships between variables. Linear Regression is a basic predictive model that finds the linear equation that best fits data points. In machine learning, we split data into a Training Set (to train the model) and a Test Set (to evaluate accuracy). We use Scikit-Learn to import models, call .fit(), and evaluate predictions using Mean Squared Error (MSE).",
        videoUrl: "https://www.w3schools.com/html/mov_bbb.mp4",
        duration: "2 hours"
      }
    ]
  }
];
