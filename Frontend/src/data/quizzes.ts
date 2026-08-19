import { Quiz } from '../types';

export const mockQuizzes: Quiz[] = [
  {
    courseId: "COURSE001",
    courseTitle: "AWS Cloud Fundamentals",
    passingScore: 80,
    questions: [
      {
        id: "Q1_1",
        questionText: "What is Amazon S3 primarily used for?",
        options: [
          "Object storage",
          "Database management",
          "DNS management",
          "Serverless functions"
        ],
        correctAnswerIndex: 0
      },
      {
        id: "Q1_2",
        questionText: "Which AWS service is used to deploy virtual servers (instances)?",
        options: [
          "AWS Lambda",
          "Amazon RDS",
          "Amazon EC2",
          "Amazon Route 53"
        ],
        correctAnswerIndex: 2
      },
      {
        id: "Q1_3",
        questionText: "What does the principle of 'least privilege' in AWS IAM refer to?",
        options: [
          "Granting admin permissions to all developers by default",
          "Granting only the permissions required to perform a specific task",
          "Deleting inactive accounts immediately",
          "Restricting users to only access AWS console via the command line"
        ],
        correctAnswerIndex: 1
      },
      {
        id: "Q1_4",
        questionText: "Which AWS service allows you to run code without provisioning or managing servers?",
        options: [
          "Amazon EC2",
          "Amazon Lightsail",
          "AWS Lambda",
          "Amazon EBS"
        ],
        correctAnswerIndex: 2
      },
      {
        id: "Q1_5",
        questionText: "AWS Availability Zones (AZs) are connected using what type of network?",
        options: [
          "Public Internet",
          "Satellite link",
          "Low-latency, redundant private fiber-optic networking",
          "Standard VPN connections"
        ],
        correctAnswerIndex: 2
      }
    ]
  },
  {
    courseId: "COURSE002",
    courseTitle: "Java Backend Development",
    passingScore: 80,
    questions: [
      {
        id: "Q2_1",
        questionText: "Which annotation is used to define a RESTful controller in Spring Boot?",
        options: [
          "@Controller",
          "@RestController",
          "@Service",
          "@Repository"
        ],
        correctAnswerIndex: 1
      },
      {
        id: "Q2_2",
        questionText: "How does Hibernate interface with SQL databases?",
        options: [
          "By compiling Java code directly into SQL scripts during execution",
          "Via Object-Relational Mapping (ORM) that maps Java entities to SQL tables",
          "By executing raw text strings inside a standard JDBC driver exclusively",
          "Hibernate does not interface with SQL databases, only NoSQL databases"
        ],
        correctAnswerIndex: 1
      },
      {
        id: "Q2_3",
        questionText: "In Java, what is the default behavior of the Garbage Collector?",
        options: [
          "It manually frees pointer memory when a user calls the free() function",
          "It runs periodically to automatically reclaim heap memory allocated to unreferenced objects",
          "It forces the system to terminate if memory exceeds 80%",
          "It compresses the database connection pool"
        ],
        correctAnswerIndex: 1
      },
      {
        id: "Q2_4",
        questionText: "What is Spring Security JWT primarily used for in REST APIs?",
        options: [
          "To format the database return payload",
          "To encrypt Java source code files during compilation",
          "Stateless session authentication and authorization verify via token signatures",
          "To load CSS styles onto web dashboards"
        ],
        correctAnswerIndex: 2
      },
      {
        id: "Q2_5",
        questionText: "Which JUnit annotation specifies that a method is a unit test?",
        options: [
          "@UnitTest",
          "@Execute",
          "@Test",
          "@Verify"
        ],
        correctAnswerIndex: 2
      }
    ]
  },
  {
    courseId: "COURSE003",
    courseTitle: "Python for Data Analytics",
    passingScore: 80,
    questions: [
      {
        id: "Q3_1",
        questionText: "Which Python package is primarily used to work with labeled tabular datasets in DataFrames?",
        options: [
          "NumPy",
          "Seaborn",
          "Pandas",
          "Scikit-Learn"
        ],
        correctAnswerIndex: 2
      },
      {
        id: "Q3_2",
        questionText: "What is the NumPy library specifically optimized for?",
        options: [
          "Multi-threaded socket connection configurations",
          "High-performance operations on multi-dimensional arrays and matrices",
          "Creating desktop graphic user interfaces",
          "Parsing HTML and XML strings from standard web pages"
        ],
        correctAnswerIndex: 1
      },
      {
        id: "Q3_3",
        questionText: "Which Python code snippet represents a valid list comprehension?",
        options: [
          "[x * 2 for x in my_list]",
          "{x * 2 in my_list}",
          "(x * 2 loops my_list)",
          "[x * 2 | x <- my_list]"
        ],
        correctAnswerIndex: 0
      },
      {
        id: "Q3_4",
        questionText: "Which library is a high-level statistical plotting package built on top of Matplotlib?",
        options: [
          "Pandas",
          "Seaborn",
          "NumPy",
          "Flask"
        ],
        correctAnswerIndex: 1
      },
      {
        id: "Q3_5",
        questionText: "In Scikit-Learn, which function is called to train a regression or classification model?",
        options: [
          "model.train()",
          "model.learn()",
          "model.fit()",
          "model.predict()"
        ],
        correctAnswerIndex: 2
      }
    ]
  }
];
