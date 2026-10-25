// Portfolio Data Module - Piyush Pandey (Data Engineer)

const PORTFOLIO_DATA = {
  profile: {
    name: "Piyush Pandey",
    title: "Consultant (AM) - Data Engineer @ Deloitte",
    experienceYears: 3,
    email: "pandey1289piyush@gmail.com",
    phone: "+91-8439422492",
    github: "https://github.com/piyush485",
    linkedin: "https://www.linkedin.com/in/piyush-pandey-91b2831b4/",
    location: "India",
    certification: "Databricks Certified Data Engineer Associate",
    resumeUrl: "Piyush_Pandey_Resume.pdf",
    education: "B.Tech. in Computer Science & Engineering — GPA: 9.29/10.00 (Graphic Era Deemed to be University)",
    headline: "Architecting Scalable Databricks Lakehouses with PySpark, AWS, ADF & ADLS",
    bio: "Data Engineer with around 3 years of experience designing, building, and optimizing scalable ETL/ELT pipelines using Databricks, AWS, PySpark, Azure Data Factory (ADF), and ADLS. Strong expertise in Python, SQL, Delta Lake, and Unity Catalog, with hands-on experience developing optimized transformation logic for 50M+ records, implementing SCD Type 1/Type 2, and building production-grade data pipelines across Azure and AWS cloud environments.",
    status: "Databricks Certified Data Engineer Associate [ACTIVE]",
    stats: [
      { value: "3 Yrs", label: "Experience" },
      { value: "50M+", label: "Records Processed" },
      { value: "40%", label: "Automation Boost" },
      { value: "9.29", label: "B.Tech GPA" }
    ]
  },

  skills: [
    // Databricks & Spark Core
    { name: "Databricks Lakehouse", category: "core", icon: "cpu", desc: "Unity Catalog, Delta Lake, Auto Loader, Medallion Architecture, DBX Jobs" },
    { name: "PySpark & Spark API", category: "core", icon: "zap", desc: "Structured Streaming, DataFrame API, Performance Tuning, 50M+ Records Transformation" },
    { name: "Advanced SQL & Delta Lake", category: "core", icon: "database", desc: "SCD Type 1 & Type 2 Modeling, CTEs, Window Functions, Databricks SQL" },
    { name: "Apache Airflow", category: "orchestration", icon: "git-branch", desc: "DAG Design, Automated Scheduling, SLA Alarms, AI/ML Workflows (-40% manual intervention)" },

    // AWS Cloud Services
    { name: "AWS S3 & Storage", category: "aws", icon: "hard-drive", desc: "Partitioning Strategies, Storage Optimization (-15% cost), Event Notifications" },
    { name: "AWS Glue & EMR", category: "aws", icon: "layers", desc: "Glue Data Catalog, Crawlers, ETL Jobs, Transient EMR Spark Clusters" },
    { name: "AWS Lambda & Step Functions", category: "aws", icon: "code", desc: "Event-driven Pipeline Triggers, Serverless Data Transformers" },

    // Azure Cloud Services
    { name: "Azure Data Factory (ADF)", category: "azure", icon: "workflow", desc: "Orchestrating Azure Databricks Workflows, Copy Data Pipelines, Self-Hosted IR" },
    { name: "Azure ADLS Gen2", category: "azure", icon: "folder-tree", desc: "Hierarchical Namespaces, Access Control Lists (ACLs), Delta Table Storage" },

    // Databases & DevOps
    { name: "Relational & NoSQL DBs", category: "orchestration", icon: "server", desc: "MySQL, Oracle, MongoDB, Azure SQL" },
    { name: "DevOps & CI/CD", category: "orchestration", icon: "git-commit", desc: "Git, GitHub Actions, CI/CD Pipeline Automation, Linux Scripting" }
  ],

  projects: [
    {
      id: "project-1",
      title: "Event-Driven Data Ingestion Pipeline on AWS & Databricks",
      subtitle: "Automated event-driven ingestion engine using Databricks Auto Loader & Medallion Architecture",
      category: "AWS & Databricks",
      pattern: "Event-driven ingestion",
      problem: "Incoming files needed reliable ingestion even as file schemas changed over time.",
      contribution: "Implemented S3 event-triggered ingestion with Databricks Auto Loader, schema evolution, PySpark transformations, and Bronze, Silver, and Gold layers.",
      impact: "Streamlined automated ingestion of incoming file streams with zero data loss and automated schema evolution.",
      tags: ["Databricks", "Auto Loader", "PySpark", "SQL", "AWS S3", "Delta Lake", "Medallion"],
      description: "Designed an automated event-driven ingestion pipeline on AWS and Databricks. Implemented Databricks Auto Loader with schema evolution to process incoming CSV streams using PySpark and SQL. Built multi-stage transformation pipelines using Medallion Architecture (Bronze ➔ Silver ➔ Gold) in Databricks Lakehouse to deliver analytics-ready datasets.",
      architecture: [
        "Inbound data landed in AWS S3 staging buckets triggering S3 Event Notifications.",
        "Databricks Auto Loader ingested streaming files into Bronze raw Delta tables.",
        "PySpark transformations cleaned schemas and handled dynamic schema evolution.",
        "Medallion Architecture structured data into analytics-ready Gold tables.",
        "Unity Catalog enforced data governance and fine-grained access policies."
      ],
      metrics: [
        { label: "Schema Evolution", value: "Automated" },
        { label: "Data Quality Pass", value: "99.9%" },
        { label: "Ingestion Pattern", value: "Event-Driven" }
      ],
      codeSnippet: `from pyspark.sql import SparkSession
from pyspark.sql.functions import current_timestamp, col

# Databricks Auto Loader Event-Driven Ingestion Engine
spark = SparkSession.builder.appName("EventDrivenIngestion").getOrCreate()

# Read incoming CSV stream using Databricks Auto Loader
streaming_df = (spark.readStream
    .format("cloudFiles")
    .option("cloudFiles.format", "csv")
    .option("cloudFiles.schemaLocation", "dbfs:/schemas/event_ingestion")
    .option("header", "true")
    .load("s3a://piyush-enterprise-landing/events/"))

# Write micro-batch to Bronze Delta Lake layer
query = (streaming_df.writeStream
    .format("delta")
    .outputMode("append")
    .option("checkpointLocation", "dbfs:/checkpoints/bronze_events")
    .table("unity_catalog.bronze.raw_events"))`
    },
    {
      id: "project-2",
      title: "Azure Databricks & ADF Enterprise ETL (50M+ Records & SCD Type 1/2)",
      subtitle: "Enterprise data governance & pipeline orchestration across Azure Databricks & ADLS",
      category: "Deloitte - Azure & Databricks",
      pattern: "Historical data modeling",
      problem: "Enterprise data needed large-scale processing, governed access, and accurate customer history across an Azure lakehouse.",
      contribution: "Developed PySpark and SQL transformations for 50M+ records, implemented SCD Type 1 and Type 2 in Unity Catalog, and orchestrated jobs with Azure Data Factory.",
      impact: "Processed 50M+ records while implementing SCD Type 1 and Type 2 historical data modeling in Unity Catalog.",
      tags: ["Deloitte", "Azure Databricks", "Azure ADF", "ADLS Gen2", "Unity Catalog", "SCD Type 1/2", "PySpark"],
      description: "Analyzed business requirements and developed complex transformation logic using PySpark and SQL on Azure Databricks at Deloitte. Managed Unity Catalog objects and implemented SCD Type 1 and Type 2 logic to maintain accurate historical data. Designed Azure Data Factory (ADF) pipelines to orchestrate Databricks jobs across ADLS Gen2.",
      architecture: [
        "Azure Data Factory scheduled daily incremental data ingestion from source systems into ADLS Gen2.",
        "Azure Databricks executed PySpark notebook jobs processing 50M+ records.",
        "Implemented Slowly Changing Dimensions (SCD Type 1 and Type 2) to maintain historical audit trails.",
        "Unity Catalog managed central data governance, lineage tracking, and row-level access controls.",
        "ADF monitored pipeline execution and dispatched automated operational alerts."
      ],
      metrics: [
        { label: "Records Processed", value: "50 Million+" },
        { label: "Historical Modeling", value: "SCD Type 1 & 2" },
        { label: "Governance Engine", value: "Unity Catalog" }
      ],
      codeSnippet: `-- Azure Databricks SQL: Slowly Changing Dimension (SCD Type 2) Delta Merge
MERGE INTO unity_catalog.gold.dim_customer AS target
USING staging_adls.customer_changes AS source
ON target.customer_id = source.customer_id AND target.is_current = true
WHEN MATCHED AND (target.email <> source.email OR target.tier <> source.tier) THEN
  UPDATE SET target.is_current = false, target.end_date = current_date()
WHEN NOT MATCHED THEN
  INSERT (customer_id, email, tier, start_date, end_date, is_current)
  VALUES (source.customer_id, source.email, source.tier, current_date(), NULL, true);`
    },
    {
      id: "project-3",
      title: "AWS & Databricks Pipeline Performance & Storage Cost Optimizer",
      subtitle: "Spark UI job tuning, S3 partitioning optimization, and Airflow workflow automation",
      category: "Genpact - AWS & Airflow",
      pattern: "Performance & cost optimization",
      problem: "Data workflows needed less manual intervention, lower S3 storage costs, and faster Spark processing.",
      contribution: "Automated scheduling and alerts with Airflow, tuned Spark jobs, and improved S3 partitioning strategies.",
      impact: "Reduced manual pipeline intervention by 40%, lowered AWS S3 storage costs by 15%, and sped up data processing by 30%.",
      tags: ["Genpact", "Databricks", "PySpark", "Airflow", "AWS S3", "CI/CD", "GitHub"],
      description: "Architected and optimized production data pipelines at Genpact utilizing Databricks, PySpark, Python, SQL, Airflow, and AWS. Automated pipeline scheduling and alerts using Airflow DAGs and AI/ML workflows (-40% manual intervention). Engineered S3 storage partitioning strategies (-15% storage cost) and tuned Spark jobs for 30% faster data processing.",
      architecture: [
        "Architected scalable ETL pipelines processing 10M+ records daily across AWS S3.",
        "Configured Airflow DAGs with custom sensors and AI/ML operational monitoring workflows.",
        "Engineered S3 bucket partitioning strategies to optimize read/write I/O patterns.",
        "Tuned Spark shuffle partitions and broadcast joins, achieving 30% faster execution.",
        "Enforced CI/CD and version control standards using GitHub Actions."
      ],
      metrics: [
        { label: "Manual Intervention", value: "-40%" },
        { label: "S3 Storage Savings", value: "15%" },
        { label: "Processing Speedup", value: "+30%" }
      ],
      codeSnippet: `# AWS S3 Partitioning & Spark Performance Tuning
from pyspark.sql import SparkSession

spark = SparkSession.builder \\
    .appName("S3_Storage_Optimizer") \\
    .config("spark.sql.shuffle.partitions", "200") \\
    .config("spark.sql.autoBroadcastJoinThreshold", "10485760") \\
    .getOrCreate()

# Read from AWS S3 landing bucket
df = spark.read.parquet("s3a://genpact-data-lake-prod/raw_transactions/")

# Partition dynamically by year, month, and region
(df.repartition("year", "month", "region")
   .write
   .mode("overwrite")
   .partitionBy("year", "month", "region")
   .parquet("s3a://genpact-data-lake-prod/curated_transactions/"))`
    }
  ],

  notebookPresets: {
    pyspark: {
      language: "pyspark",
      title: "01_deloitte_pyspark_etl.py",
      code: `%py
# Piyush Pandey - Azure Databricks PySpark Notebook (50M+ Records ETL)
from pyspark.sql import SparkSession
from pyspark.sql.functions import col, current_timestamp, round, expr

print("⚡ Connecting to Azure Databricks Runtime (Unity Catalog Enabled)...")
print("📦 Reading 50M+ Customer Records from ADLS Gen2...")

# Load sample dataset representing Deloitte enterprise transformation
df_raw = spark.createDataFrame([
    (5001, "Deloitte_Azure_DBX", "50M_Records", "Unity_Catalog", "SCD_Type_2", "COMPLETED"),
    (5002, "Genpact_AWS_DBX", "10M_Records", "Airflow_DAG", "S3_Optimized", "COMPLETED"),
    (5003, "Auto_Loader_Stream", "CSV_Files", "Medallion_Lakehouse", "Auto_Schema", "COMPLETED"),
    (5004, "Spark_Tuning_Job", "30%_Faster", "PySpark_SQL", "200_Partitions", "COMPLETED")
], ["job_id", "environment", "volume_scale", "governance_engine", "optimization", "status"])

# Apply schema cleansing & compute summary metrics
df_transformed = (df_raw
    .filter(col("status") == "COMPLETED")
    .withColumn("processed_at", current_timestamp()))

display(df_transformed)`
    },
    sql: {
      language: "sql",
      title: "02_unity_catalog_scd_query.sql",
      code: `%sql
-- Piyush Pandey - Databricks SQL Delta Lake & Unity Catalog Analytics
SELECT 
    environment,
    volume_scale,
    governance_engine,
    optimization,
    'DATABRICKS CERTIFIED ASSOCIATE' AS certification_status
FROM 
    unity_catalog.gold.deloitte_genpact_telemetry
WHERE 
    status = 'COMPLETED'
ORDER BY 
    job_id ASC;`
    }
  },

  // Detailed Pipeline Architecture DAG Nodes
  pipelineNodes: [
    {
      id: "source",
      stepNum: "01",
      stageTag: "INGESTION LANDING",
      name: "Cloud Sources",
      sub: "AWS S3 / Azure ADLS Gen2",
      icon: "cloud",
      desc: "Multi-cloud landing zone for raw incoming datasets (CSV, JSON, GZIP) landed across AWS S3 and Azure ADLS Gen2.",
      techDetails: {
        storageFormat: "CSV / Parquet / GZIP",
        protocol: "s3a:// & abfss://",
        partitioning: "year=YYYY / month=MM / day=DD",
        storageSavings: "15% AWS S3 Cost Reduction via Partitioning",
        security: "AWS S3 Bucket Policies & ADLS Gen2 ACLs"
      },
      highlights: [
        "Databricks Auto Loader detects incoming S3/ADLS files with automated schema evolution.",
        "Optimized read/write S3 storage partitioning strategies.",
        "Processes 10M+ to 50M+ raw files daily into Lakehouse staging."
      ]
    },
    {
      id: "ingest",
      stepNum: "02",
      stageTag: "ETL & COMPUTE",
      name: "PySpark & AWS Glue / EMR",
      sub: "50M+ Records Transformation",
      icon: "cpu",
      desc: "Distributed compute processing powered by PySpark, SQL, AWS Glue, and EMR clusters.",
      techDetails: {
        engine: "PySpark 3.4 & Databricks Spark Engine",
        tuning: "30% Faster Execution via Broadcast Joins & Partition Tuning",
        efficiency: "+25% Processing Efficiency & -15% Turnaround Time",
        quality: "-20% Technical Debt via Extensible Python Modules",
        catalog: "AWS Glue Data Catalog & Unity Catalog Metadata"
      },
      highlights: [
        "Tuned Spark shuffle partitions and broadcast join thresholds.",
        "Developed reusable Python/SQL transformation modules.",
        "Processed 50M+ records with high-throughput schema enforcement."
      ]
    },
    {
      id: "lakehouse",
      stepNum: "03",
      stageTag: "UNITY CATALOG CORE",
      name: "Databricks Delta Lake",
      sub: "Medallion Architecture & SCD 1/2",
      icon: "layers",
      desc: "Unity Catalog governed Delta Lake storing Bronze raw, Silver cleansed, and Gold analytical tables with SCD Type 1 & Type 2 historical modeling.",
      techDetails: {
        architecture: "Medallion Architecture (Bronze -> Silver -> Gold)",
        dimensionModeling: "SCD Type 1 & Type 2 Historical Tracking",
        governance: "Unity Catalog Centralized Access & Lineage",
        acidTransactions: "Delta Transaction Log for Time Travel & MERGE queries",
        certification: "Databricks Certified Data Engineer Associate Standards"
      },
      highlights: [
        "Implemented SCD Type 1 & Type 2 logic for accurate historical dimension modeling.",
        "Managed Unity Catalog objects, row-level security, and audit trails.",
        "Structured Medallion Lakehouse layers for analytics-ready datasets."
      ]
    },
    {
      id: "orchestrate",
      stepNum: "04",
      stageTag: "WORKFLOW SCHEDULER",
      name: "Airflow & Azure ADF",
      sub: "Orchestration & Automation",
      icon: "git-branch",
      desc: "Production pipeline orchestration using Apache Airflow DAGs and Azure Data Factory (ADF) connecting Databricks and ADLS.",
      techDetails: {
        orchestrators: "Apache Airflow DAGs & Azure Data Factory (ADF)",
        automationBoost: "Reduced manual intervention by 40%",
        devops: "Git, GitHub Actions, CI/CD Pipeline Automation",
        monitoring: "AI/ML Workflows & Automated Slack/PagerDuty Alerts",
        triggers: "ADF Databricks Activity Triggers & Airflow Sensors"
      },
      highlights: [
        "Designed ADF pipelines triggering Azure Databricks notebook jobs across ADLS.",
        "Automated Airflow DAG schedules with AI/ML monitoring workflows.",
        "Enforced CI/CD version control via GitHub."
      ]
    },
    {
      id: "monitor",
      stepNum: "05",
      stageTag: "SERVING & ANALYTICS",
      name: "AWS CloudWatch & SQL",
      sub: "Analytics-Ready Datasets",
      icon: "activity",
      desc: "Delivering analytics-ready datasets for enterprise reporting while dispatching real-time AWS CloudWatch telemetry alarms.",
      techDetails: {
        serving: "Databricks Serverless SQL Endpoints & Azure SQL",
        monitoring: "AWS CloudWatch Metric Alarms & Log Insights",
        databases: "MySQL, Oracle, MongoDB, Azure SQL",
        slaCompliance: "99.95% Pipeline SLA Met",
        collaboration: "Delivered analytics datasets across cross-functional teams"
      },
      highlights: [
        "Delivered analytics-ready datasets improving project turnaround by 15%.",
        "Configured CloudWatch custom metrics for memory and SLA breach alerts.",
        "Integrated multi-database sources into Databricks Gold serving layer."
      ]
    }
  ],

  // Structured Company Career Timeline with Exact Dates
  experience: [
    {
      company: "Deloitte",
      period: "July 2026 - Present | India",
      roles: [
        {
          title: "Consultant (AM) - Data Engineer",
          period: "July 2026 - Present",
          isPromoted: false,
          highlights: [
            "Requirement Analysis & Development: Analyzed business requirements and developed transformation logic using PySpark and SQL on Azure Databricks, processing 50M+ records with performance optimizations.",
            "Data Governance & Modeling: Managed Unity Catalog objects and implemented SCD Type 1 and Type 2 logic to maintain accurate and governed historical data.",
            "Pipeline Orchestration: Designed and implemented automated data pipelines using Azure Data Factory (ADF) to orchestrate Azure Databricks workflows and data processing across ADLS."
          ]
        }
      ]
    },
    {
      company: "Genpact",
      period: "Jan 2024 - July 2026 | India",
      roles: [
        {
          title: "Consultant - Data Engineer",
          period: "Oct 2025 - July 2026",
          isPromoted: true,
          highlights: [
            "Pipeline Architecture & Optimization: Architected and optimized production-grade data pipelines utilizing Databricks, PySpark, Python, SQL, Airflow, and AWS, with CI/CD and version control implemented via GitHub.",
            "Data Orchestration & Automation: Automated pipeline scheduling, monitoring, and alerting using Airflow DAGs and AI/ML workflows, enhancing workflow reliability and reducing manual intervention by 40%.",
            "Cloud & Storage Optimization: Engineered efficient AWS S3 storage and partitioning strategies, optimizing read/write patterns and reducing storage costs by 15%.",
            "Performance Improvements: Tuned Spark jobs, SQL queries, AI enablement and transformations, achieving 30% faster data processing and improving overall system performance."
          ]
        },
        {
          title: "Senior Associate - Data Engineer",
          period: "Jan 2024 - Sept 2025",
          isPromoted: false,
          highlights: [
            "Data Pipeline Development & Collaboration: Collaborated with cross-functional teams to gather requirements and deliver analytics-ready datasets through scalable ETL pipelines using Databricks, PySpark, SQL, and AWS S3, processing 10M+ records daily (+25% processing efficiency, -15% turnaround time).",
            "Code Quality & Optimization: Developed maintainable and extensible Python and SQL-based solutions, strengthening code quality standards, reducing technical debt by 20%, and improving overall system maintainability."
          ]
        }
      ]
    }
  ]
};

if (typeof window !== 'undefined') {
  window.PORTFOLIO_DATA = PORTFOLIO_DATA;
}
