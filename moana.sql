-- MySQL Script generated by MySQL Workbench
-- Mon Dec  3 16:23:48 2018
-- Model: New Model    Version: 1.0
-- MySQL Workbench Forward Engineering

SET @OLD_UNIQUE_CHECKS=@@UNIQUE_CHECKS, UNIQUE_CHECKS=0;
SET @OLD_FOREIGN_KEY_CHECKS=@@FOREIGN_KEY_CHECKS, FOREIGN_KEY_CHECKS=0;
SET @OLD_SQL_MODE=@@SQL_MODE, SQL_MODE='ONLY_FULL_GROUP_BY,STRICT_TRANS_TABLES,NO_ZERO_IN_DATE,NO_ZERO_DATE,ERROR_FOR_DIVISION_BY_ZERO,NO_ENGINE_SUBSTITUTION';

-- -----------------------------------------------------
-- Schema mydb
-- -----------------------------------------------------

-- -----------------------------------------------------
-- Schema mydb
-- -----------------------------------------------------
CREATE SCHEMA IF NOT EXISTS `mydb` DEFAULT CHARACTER SET utf8 ;
USE `mydb` ;

-- -----------------------------------------------------
-- Table `mydb`.`SPORT`
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS `mydb`.`SPORT` (
  `S_Name` VARCHAR(20) NOT NULL,
  `S_Type` VARCHAR(20) NULL,
  PRIMARY KEY (`S_Name`))
ENGINE = InnoDB;


-- -----------------------------------------------------
-- Table `mydb`.`COUNTRY`
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS `mydb`.`COUNTRY` (
  `N_O_P` INT NULL,
  `C_Code` VARCHAR(3) NOT NULL,
  `Continent` VARCHAR(20) NULL,
  `C_Name` VARCHAR(20) NULL,
  PRIMARY KEY (`C_Code`))
ENGINE = InnoDB;


-- -----------------------------------------------------
-- Table `mydb`.`PLAYER`
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS `mydb`.`PLAYER` (
  `P_Name` VARCHAR(20) NOT NULL,
  `Phone_Num` VARCHAR(13) NULL,
  `Age` INT NULL,
  `Height` INT NULL,
  `Weight` INT NULL,
  `Lead_By` VARCHAR(20) NOT NULL,
  `Sport` VARCHAR(20) NOT NULL,
  `Country` VARCHAR(3) NOT NULL,
  PRIMARY KEY (`P_Name`, `Sport`, `Country`),
  INDEX `fk_Player_Player1_idx` (`Lead_By` ASC) VISIBLE,
  INDEX `fk_Player_Sport1_idx` (`Sport` ASC) VISIBLE,
  INDEX `fk_Player_Country1_idx` (`Country` ASC) VISIBLE,
  CONSTRAINT `fk_Player_Player1`
    FOREIGN KEY (`Lead_By`)
    REFERENCES `mydb`.`PLAYER` (`P_Name`)
    ON DELETE NO ACTION
    ON UPDATE NO ACTION,
  CONSTRAINT `fk_Player_Sport1`
    FOREIGN KEY (`Sport`)
    REFERENCES `mydb`.`SPORT` (`S_Name`)
    ON DELETE NO ACTION
    ON UPDATE NO ACTION,
  CONSTRAINT `fk_Player_Country1`
    FOREIGN KEY (`Country`)
    REFERENCES `mydb`.`COUNTRY` (`C_Code`)
    ON DELETE NO ACTION
    ON UPDATE NO ACTION)
ENGINE = InnoDB;


-- -----------------------------------------------------
-- Table `mydb`.`PLACE`
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS `mydb`.`PLACE` (
  `B_Name` VARCHAR(20) NOT NULL,
  `B_Code` VARCHAR(10) NULL,
  `Address` VARCHAR(50) NULL,
  PRIMARY KEY (`B_Name`))
ENGINE = InnoDB;


-- -----------------------------------------------------
-- Table `mydb`.`EVENT`
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS `mydb`.`EVENT` (
  `Date` DATE NULL,
  `TIME` TIME NULL,
  `E_Type` VARCHAR(20) NOT NULL,
  `S_Name` VARCHAR(20) NOT NULL,
  `Place` VARCHAR(20) NOT NULL,
  PRIMARY KEY (`E_Type`, `S_Name`, `Place`),
  INDEX `fk_Event_Sport1_idx` (`S_Name` ASC) VISIBLE,
  INDEX `fk_Event_Place1_idx` (`Place` ASC) VISIBLE,
  CONSTRAINT `fk_Event_Sport1`
    FOREIGN KEY (`S_Name`)
    REFERENCES `mydb`.`SPORT` (`S_Name`)
    ON DELETE NO ACTION
    ON UPDATE NO ACTION,
  CONSTRAINT `fk_Event_Place1`
    FOREIGN KEY (`Place`)
    REFERENCES `mydb`.`PLACE` (`B_Name`)
    ON DELETE NO ACTION
    ON UPDATE NO ACTION)
ENGINE = InnoDB;


-- -----------------------------------------------------
-- Table `mydb`.`PLAYER_EVENT`
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS `mydb`.`PLAYER_EVENT` (
  `Player` VARCHAR(20) NOT NULL,
  `E_Type` VARCHAR(20) NOT NULL,
  `S_Name` VARCHAR(20) NOT NULL,
  PRIMARY KEY (`Player`, `E_Type`, `S_Name`),
  INDEX `fk_Player_has_Event_Event1_idx` (`E_Type` ASC, `S_Name` ASC) VISIBLE,
  INDEX `fk_Player_has_Event_Player1_idx` (`Player` ASC) VISIBLE,
  CONSTRAINT `fk_Player_has_Event_Player1`
    FOREIGN KEY (`Player`)
    REFERENCES `mydb`.`PLAYER` (`P_Name`)
    ON DELETE NO ACTION
    ON UPDATE NO ACTION,
  CONSTRAINT `fk_Player_has_Event_Event1`
    FOREIGN KEY (`E_Type`)
    REFERENCES `mydb`.`EVENT` (`E_Type`)
    ON DELETE NO ACTION
    ON UPDATE NO ACTION)
ENGINE = InnoDB;


SET SQL_MODE=@OLD_SQL_MODE;
SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS;
SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS;
