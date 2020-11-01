-- MySQL dump 10.13  Distrib 8.0.21, for Win64 (x86_64)
--
-- Host: localhost    Database: mealmate
-- ------------------------------------------------------
-- Server version	8.0.21

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
-- Table structure for table `answers`
--

DROP TABLE IF EXISTS `answers`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `answers` (
  `answers_id` int NOT NULL AUTO_INCREMENT,
  `answer_text` varchar(45) DEFAULT NULL,
  `saq_answer_id_fk` int NOT NULL,
  PRIMARY KEY (`answers_id`),
  KEY `saq_answer_id_fk_idx` (`saq_answer_id_fk`),
  CONSTRAINT `saq_answer_id_fk` FOREIGN KEY (`saq_answer_id_fk`) REFERENCES `survey_answer_question` (`survey_answer_question_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Table structure for table `ingredients`
--

DROP TABLE IF EXISTS `ingredients`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `ingredients` (
  `ingredient_id` int NOT NULL AUTO_INCREMENT,
  PRIMARY KEY (`ingredient_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Table structure for table `nutrition`
--

DROP TABLE IF EXISTS `nutrition`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `nutrition` (
  `nutrition_id` int NOT NULL AUTO_INCREMENT,
  `calories` decimal(5,2) DEFAULT NULL,
  `total_fat` decimal(5,2) DEFAULT NULL,
  `sugar` decimal(5,2) DEFAULT NULL,
  `sodium` decimal(5,2) DEFAULT NULL,
  `protein` decimal(5,2) DEFAULT NULL,
  `saturated_fat` decimal(5,2) DEFAULT NULL,
  `carbohydrates` decimal(5,2) DEFAULT NULL,
  `nut_recipe_id_fk` int NOT NULL,
  PRIMARY KEY (`nutrition_id`),
  KEY `nut_recipe_id_fk_idx` (`nut_recipe_id_fk`),
  CONSTRAINT `nut_recipe_id_fk` FOREIGN KEY (`nut_recipe_id_fk`) REFERENCES `recipes` (`recipe_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Table structure for table `question`
--

DROP TABLE IF EXISTS `question`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `question` (
  `question_id` int NOT NULL AUTO_INCREMENT,
  `question_text` varchar(45) DEFAULT NULL,
  PRIMARY KEY (`question_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Table structure for table `recipe_ingredient`
--

DROP TABLE IF EXISTS `recipe_ingredient`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `recipe_ingredient` (
  `recipe_ingredient_id` int NOT NULL AUTO_INCREMENT,
  `FK_ing_recipe_id` int DEFAULT NULL,
  `FK_rec_ingredient_id` int DEFAULT NULL,
  `ingredient_amount` varchar(100) DEFAULT NULL,
  PRIMARY KEY (`recipe_ingredient_id`),
  KEY `FK_rec_ingredient_id_idx` (`FK_rec_ingredient_id`),
  KEY `FK_ing_recipe_id_idx` (`FK_ing_recipe_id`),
  CONSTRAINT `FK_ing_recipe_id` FOREIGN KEY (`FK_ing_recipe_id`) REFERENCES `ingredients` (`ingredient_id`),
  CONSTRAINT `FK_rec_ingredient_id` FOREIGN KEY (`FK_rec_ingredient_id`) REFERENCES `recipes` (`recipe_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Table structure for table `recipes`
--

DROP TABLE IF EXISTS `recipes`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `recipes` (
  `name` varchar(100) NOT NULL,
  `recipe_id` int NOT NULL AUTO_INCREMENT,
  `minutes` int DEFAULT NULL,
  `contributor_id` int DEFAULT NULL,
  `submitted` date DEFAULT NULL,
  `tags` varchar(1500) DEFAULT NULL,
  `rec_step_id_fk` int DEFAULT NULL,
  `description` varchar(1500) DEFAULT NULL,
  `ingredients` varchar(1500) DEFAULT NULL,
  `n_ingredients` int DEFAULT NULL,
  PRIMARY KEY (`recipe_id`),
  KEY `rec_step_id_fk_idx` (`rec_step_id_fk`),
  CONSTRAINT `rec_step_id_fk` FOREIGN KEY (`rec_step_id_fk`) REFERENCES `steps` (`steps_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Table structure for table `recommended_recipe`
--

DROP TABLE IF EXISTS `recommended_recipe`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `recommended_recipe` (
  `recommended_recipe_id` int NOT NULL AUTO_INCREMENT,
  `FK_rec_recipe_id` int NOT NULL,
  `rec_answer_id_fk` int NOT NULL,
  PRIMARY KEY (`recommended_recipe_id`),
  KEY `FK_rec_recipe_id_idx` (`FK_rec_recipe_id`),
  KEY `rec_answer_id_fk_idx` (`rec_answer_id_fk`),
  CONSTRAINT `FK_rec_recipe_id` FOREIGN KEY (`FK_rec_recipe_id`) REFERENCES `recipes` (`recipe_id`),
  CONSTRAINT `rec_answer_id_fk` FOREIGN KEY (`rec_answer_id_fk`) REFERENCES `answers` (`answers_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Table structure for table `reviews`
--

DROP TABLE IF EXISTS `reviews`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `reviews` (
  `review_id` int NOT NULL AUTO_INCREMENT,
  `review_recipe_id_fk` int NOT NULL,
  `review_user_id_fk` int NOT NULL,
  `review_text` varchar(1000) DEFAULT NULL,
  `review_rating` int DEFAULT NULL,
  `review_date` datetime DEFAULT NULL,
  PRIMARY KEY (`review_id`),
  KEY `review_recipe_id_fk_idx` (`review_recipe_id_fk`),
  KEY `review_user_id_fk_idx` (`review_user_id_fk`),
  CONSTRAINT `review_recipe_id_fk` FOREIGN KEY (`review_recipe_id_fk`) REFERENCES `recipes` (`recipe_id`),
  CONSTRAINT `review_user_id_fk` FOREIGN KEY (`review_user_id_fk`) REFERENCES `user` (`user_id`)
) ENGINE=InnoDB AUTO_INCREMENT=2 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Table structure for table `steps`
--

DROP TABLE IF EXISTS `steps`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `steps` (
  `steps_id` int NOT NULL AUTO_INCREMENT,
  `n_steps` int DEFAULT NULL,
  `steps_text` varchar(500) DEFAULT NULL,
  `recipe_id` int DEFAULT NULL,
  PRIMARY KEY (`steps_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Table structure for table `survey`
--

DROP TABLE IF EXISTS `survey`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `survey` (
  `survey_id` int NOT NULL AUTO_INCREMENT,
  `description` varchar(45) DEFAULT NULL,
  `name` varchar(45) DEFAULT NULL,
  PRIMARY KEY (`survey_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Table structure for table `survey_answer_question`
--

DROP TABLE IF EXISTS `survey_answer_question`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `survey_answer_question` (
  `survey_answer_question_id` int NOT NULL AUTO_INCREMENT,
  `sq_saq_id_fk` int NOT NULL,
  PRIMARY KEY (`survey_answer_question_id`),
  KEY `sq_saq_id_fk_idx` (`sq_saq_id_fk`),
  CONSTRAINT `sq_saq_id_fk` FOREIGN KEY (`sq_saq_id_fk`) REFERENCES `survey_question` (`survey_question_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Table structure for table `survey_question`
--

DROP TABLE IF EXISTS `survey_question`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `survey_question` (
  `survey_question_id` int NOT NULL AUTO_INCREMENT,
  `sq_survey_id_fk` int NOT NULL,
  `sq_question_id_fk` int NOT NULL,
  PRIMARY KEY (`survey_question_id`),
  KEY `sq_question_id_fk_idx` (`sq_question_id_fk`),
  KEY `sq_survey_id_fk_idx` (`sq_survey_id_fk`),
  CONSTRAINT `sq_question_id_fk` FOREIGN KEY (`sq_question_id_fk`) REFERENCES `question` (`question_id`),
  CONSTRAINT `sq_survey_id_fk` FOREIGN KEY (`sq_survey_id_fk`) REFERENCES `survey` (`survey_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Table structure for table `user`
--

DROP TABLE IF EXISTS `user`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `user` (
  `user_id` int NOT NULL AUTO_INCREMENT,
  `user_ga_cookie` varchar(250) DEFAULT NULL,
  `user_name` varchar(45) DEFAULT NULL,
  PRIMARY KEY (`user_id`)
) ENGINE=InnoDB AUTO_INCREMENT=2 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Table structure for table `user_answers`
--

DROP TABLE IF EXISTS `user_answers`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `user_answers` (
  `user_answers_id` int NOT NULL AUTO_INCREMENT,
  `user_id` int NOT NULL,
  `answer_id` int NOT NULL,
  PRIMARY KEY (`user_answers_id`),
  KEY `user_id_idx` (`user_id`),
  KEY `answer_id_idx` (`answer_id`),
  CONSTRAINT `answer_id` FOREIGN KEY (`answer_id`) REFERENCES `answers` (`answers_id`),
  CONSTRAINT `user_id` FOREIGN KEY (`user_id`) REFERENCES `user` (`user_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;
/*!40103 SET TIME_ZONE=@OLD_TIME_ZONE */;

/*!40101 SET SQL_MODE=@OLD_SQL_MODE */;
/*!40014 SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS */;
/*!40014 SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
/*!40111 SET SQL_NOTES=@OLD_SQL_NOTES */;

-- Dump completed on 2020-11-01 15:10:43
