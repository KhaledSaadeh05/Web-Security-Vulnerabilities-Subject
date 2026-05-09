CREATE DATABASE  IF NOT EXISTS `web_security` /*!40100 DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci */ /*!80016 DEFAULT ENCRYPTION='N' */;
USE `web_security`;
-- MySQL dump 10.13  Distrib 8.0.45, for Win64 (x86_64)
--
-- Host: 127.0.0.1    Database: web_security
-- ------------------------------------------------------
-- Server version	8.0.45

/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!50503 SET NAMES utf8 */;
/*!40103 SET @OLD_TIME_ZONE=@@TIME_ZONE */;
/*!40103 SET TIME_ZONE='+00:00' */;
/*!40014 SET @OLD_UNIQUE_CHECKS=@@UNIQUE_CHECKS, UNIQUE_CHECKS=0 */;
/*!40014 SET @OLD_FOREIGN_KEY_CHECKS=@@FOREIGN_KEY_CHECKS, FOREIGN_KEY_CHECKS=0 */;
/*!40101 SET @OLD_SQL_MODE=@@SQL_MODE, SQL_MODE='NO_AUTO_VALUE_ON_ZERO' */;
/*!40111 SET @OLD_SQL_NOTES=@@SQL_NOTES, SQL_NOTES=0 */;

--
-- Table structure for table `lab_logs`
--

DROP TABLE IF EXISTS `lab_logs`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `lab_logs` (
  `id` int NOT NULL AUTO_INCREMENT,
  `input_type` varchar(50) DEFAULT NULL,
  `input_value` text,
  `matched_case` varchar(100) DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=22 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `lab_logs`
--

LOCK TABLES `lab_logs` WRITE;
/*!40000 ALTER TABLE `lab_logs` DISABLE KEYS */;
INSERT INTO `lab_logs` VALUES (1,'category','all','Normal Category Filter','2026-04-19 20:00:04'),(2,'login','admin | admin123','Admin Username Attempt','2026-04-19 20:00:09'),(3,'category','all','Normal Category Filter','2026-04-19 20:00:20'),(4,'category','clothes','Normal Category Filter','2026-04-19 20:00:28'),(5,'category','accessories','Bypass Pattern Detected','2026-04-19 20:00:28'),(6,'category','tech','Normal Category Filter','2026-04-19 20:00:29'),(7,'category','tech','Normal Category Filter','2026-04-19 20:03:43'),(8,'category','all','Normal Category Filter','2026-04-19 20:10:07'),(9,'category','all','Normal Category Filter','2026-04-19 20:24:54'),(10,'login','administrator\'-- | 12345','Bypass Pattern Detected','2026-04-19 20:24:59'),(11,'login','administrator\'-- | 12345','Bypass Pattern Detected','2026-04-19 20:25:04'),(12,'login','administrator\'-- | 12345','Bypass Pattern Detected','2026-04-19 20:25:06'),(13,'category','all','Normal Category Filter','2026-04-19 20:32:45'),(14,'category','all','Normal Category Filter','2026-04-19 20:33:07'),(15,'login','administrator\'-- | 12345','Bypass Pattern Detected','2026-04-19 20:33:23'),(16,'login','admin\'-- | 12345','Special Character Pattern','2026-04-19 20:33:33'),(17,'login','admin\'-- | 12345','Special Character Pattern','2026-04-19 20:33:33'),(18,'login','admin\'-- | 12345','Special Character Pattern','2026-04-19 20:33:37'),(19,'login','admin\'-- | 123','Special Character Pattern','2026-04-19 20:33:46'),(20,'login','admin\'-- | 123','Special Character Pattern','2026-04-19 20:33:48'),(21,'login','admin\'-- | 123','Special Character Pattern','2026-04-19 20:33:48');
/*!40000 ALTER TABLE `lab_logs` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `products`
--

DROP TABLE IF EXISTS `products`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `products` (
  `id` int NOT NULL AUTO_INCREMENT,
  `name` varchar(100) DEFAULT NULL,
  `category` varchar(50) DEFAULT NULL,
  `price` int DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=5 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `products`
--

LOCK TABLES `products` WRITE;
/*!40000 ALTER TABLE `products` DISABLE KEYS */;
INSERT INTO `products` VALUES (1,'Laptop','tech',650),(2,'Mouse','tech',15),(3,'Shirt','clothes',20),(4,'Watch','accessories',50);
/*!40000 ALTER TABLE `products` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `users`
--

DROP TABLE IF EXISTS `users`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `users` (
  `id` int NOT NULL AUTO_INCREMENT,
  `username` varchar(50) DEFAULT NULL,
  `password` varchar(50) DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=4 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `users`
--

LOCK TABLES `users` WRITE;
/*!40000 ALTER TABLE `users` DISABLE KEYS */;
INSERT INTO `users` VALUES (1,'admin','admin123'),(2,'khaled','1234'),(3,'user','pass');
/*!40000 ALTER TABLE `users` ENABLE KEYS */;
UNLOCK TABLES;
/*!40103 SET TIME_ZONE=@OLD_TIME_ZONE */;

/*!40101 SET SQL_MODE=@OLD_SQL_MODE */;
/*!40014 SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS */;
/*!40014 SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
/*!40111 SET SQL_NOTES=@OLD_SQL_NOTES */;

-- Dump completed on 2026-04-19 23:42:39
