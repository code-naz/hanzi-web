-- CreateTable
CREATE TABLE `hanzi_entries` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `source_id` VARCHAR(32) NOT NULL,
    `level` TINYINT NOT NULL,
    `simplified` VARCHAR(50) NOT NULL,
    `pinyin` VARCHAR(100) NOT NULL,
    `pinyin_normalized` VARCHAR(120) NOT NULL,
    `meaning` TEXT NOT NULL,
    `sentence` TEXT NOT NULL,
    `sentence_pinyin` TEXT NOT NULL,
    `sentence_pinyin_normalized` VARCHAR(180) NOT NULL,
    `sentence_normalized` TEXT NOT NULL,
    `sentence_meaning` TEXT NOT NULL,
    `category` VARCHAR(100) NOT NULL,
    `created_at` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updated_at` DATETIME(3) NOT NULL,

    UNIQUE INDEX `hanzi_entries_source_id_key`(`source_id`),
    INDEX `hanzi_entries_simplified_idx`(`simplified`),
    INDEX `hanzi_entries_pinyin_normalized_idx`(`pinyin_normalized`),
    INDEX `hanzi_entries_level_idx`(`level`),
    INDEX `hanzi_entries_category_idx`(`category`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
