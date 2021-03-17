-- phpMyAdmin SQL Dump
-- version 5.0.4
-- https://www.phpmyadmin.net/
--
-- Host: 127.0.0.1
-- Generation Time: Mar 08, 2021 at 02:09 PM
-- Server version: 10.4.17-MariaDB
-- PHP Version: 7.3.27

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Database: `ecommercebotpoc`
--

-- --------------------------------------------------------

--
-- Table structure for table `cancellation`
--

CREATE TABLE `cancellation` (
  `cancellation_id` int(11) NOT NULL,
  `order_id` varchar(5) DEFAULT NULL COMMENT 'this is the order_id from orders table',
  `reason` varchar(50) DEFAULT NULL,
  `date` datetime NOT NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- --------------------------------------------------------

--
-- Table structure for table `delivery`
--

CREATE TABLE `delivery` (
  `delivery_id` int(11) NOT NULL,
  `order_id` varchar(5) DEFAULT NULL COMMENT 'this is the order_id from orders table',
  `product_name` varchar(50) DEFAULT NULL,
  `delivery_time` datetime NOT NULL DEFAULT current_timestamp(),
  `agent_name` varchar(50) DEFAULT NULL,
  `agent_contact` varchar(50) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

--
-- Dumping data for table `delivery`
--

INSERT INTO `delivery` (`delivery_id`, `order_id`, `product_name`, `delivery_time`, `agent_name`, `agent_contact`) VALUES
(1, '10004', 'Samsung S9', '2021-03-01 14:24:39', 'Ramesh', '9820835218'),
(2, '10005', 'Camera ', '2021-03-01 14:24:39', 'Ganesh', '9766622331'),
(3, '10007', 'choclates ', '2021-03-01 14:24:39', 'Suresh', '9788566413'),
(4, '10009', 'Mango', '2021-03-01 14:24:39', 'Mahesh', '9876544563');

-- --------------------------------------------------------

--
-- Table structure for table `orders`
--

CREATE TABLE `orders` (
  `order_id` varchar(5) NOT NULL,
  `product_name` varchar(50) DEFAULT NULL,
  `date` datetime DEFAULT current_timestamp(),
  `status` varchar(50) DEFAULT NULL,
  `product_image` varchar(100) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

--
-- Dumping data for table `orders`
--

INSERT INTO `orders` (`order_id`, `product_name`, `date`, `status`, `product_image`) VALUES
('10001', 'dell laptop', '2021-03-01 14:16:34', 'packed', 'https://raw.githubusercontent.com/dpmanek/images/main/Laptop.jpg'),
('10002', 'headphones', '2021-03-01 14:20:18', 'shipped', 'https://raw.githubusercontent.com/dpmanek/images/main/headphones.jpeg'),
('10003', 'iphone 12', '2021-03-01 14:16:34', 'shipped', 'https://raw.githubusercontent.com/dpmanek/images/main/Iphone12.jpg'),
('10004', 'Samsung S9', '2021-03-01 14:18:55', 'out for delivery', 'https://raw.githubusercontent.com/dpmanek/images/main/samsungs9.jpg'),
('10005', 'Camera ', '2021-03-01 14:18:55', 'delivered', 'https://raw.githubusercontent.com/dpmanek/images/main/camera.jpg'),
('10006', 'Macbook ', '2021-03-01 14:18:55', 'shipped', 'https://raw.githubusercontent.com/dpmanek/images/main/Macbookair.jpg'),
('10007', 'choclates ', '2021-03-01 14:18:55', 'out for delivery', 'https://raw.githubusercontent.com/dpmanek/images/main/chocolate.jpg'),
('10008', 'sunglasses ', '2021-03-01 14:18:55', 'packed', 'https://raw.githubusercontent.com/dpmanek/images/main/sunglasses.jpg'),
('10009', 'Mango', '2021-03-01 14:19:47', 'delivered', 'https://raw.githubusercontent.com/dpmanek/images/main/Mango.jpg'),
('10010', 'oil', '2021-03-01 14:19:47', 'packed', 'https://raw.githubusercontent.com/dpmanek/images/main/oil.jpg');

--
-- Indexes for dumped tables
--

--
-- Indexes for table `cancellation`
--
ALTER TABLE `cancellation`
  ADD PRIMARY KEY (`cancellation_id`);

--
-- Indexes for table `delivery`
--
ALTER TABLE `delivery`
  ADD PRIMARY KEY (`delivery_id`);

--
-- Indexes for table `orders`
--
ALTER TABLE `orders`
  ADD PRIMARY KEY (`order_id`);

--
-- AUTO_INCREMENT for dumped tables
--

--
-- AUTO_INCREMENT for table `cancellation`
--
ALTER TABLE `cancellation`
  MODIFY `cancellation_id` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `delivery`
--
ALTER TABLE `delivery`
  MODIFY `delivery_id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=5;
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
