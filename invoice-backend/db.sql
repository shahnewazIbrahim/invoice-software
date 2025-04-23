-- Create 'invoices' table
CREATE TABLE `invoices` (
  `id` INT AUTO_INCREMENT PRIMARY KEY,
  `invoiceNumber` VARCHAR(255) NOT NULL UNIQUE,
  `invoiceDate` DATE NOT NULL,
  `dueDate` DATE NOT NULL,
  `clientName` VARCHAR(255) NOT NULL,
  `clientEmail` VARCHAR(255) NOT NULL,
  `status` ENUM('pending', 'paid', 'overdue') NOT NULL,
  `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  `updated_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

-- Create 'invoice_items' table
CREATE TABLE `invoice_items` (
  `id` INT AUTO_INCREMENT PRIMARY KEY,
  `invoiceId` INT NOT NULL,
  `description` TEXT NOT NULL,
  `quantity` INT NOT NULL,
  `price` DECIMAL(10, 2) NOT NULL,
  `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  `updated_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  FOREIGN KEY (`invoiceId`) REFERENCES `invoices`(`id`) ON DELETE CASCADE
);
