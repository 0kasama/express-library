CREATE TYPE "status" AS ENUM (
  'BORROWED',
  'RETURNED'
);

CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = CURRENT_TIMESTAMP;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;


CREATE TABLE "books" (
  "id" UUID PRIMARY KEY,
  "title" VARCHAR(255) NOT NULL,
  "author" VARCHAR(255) NOT NULL,
  "published_year" INT NOT NULL,
  "stock" INT NOT NULL DEFAULT 0,
  "created_at" TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  "updated_at" TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  "isbn" VARCHAR(13) UNIQUE NOT NULL
);

CREATE TABLE "members" (
  "id" UUID PRIMARY KEY,
  "name" VARCHAR(255) NOT NULL,
  "email" VARCHAR(255) UNIQUE NOT NULL,
  "phone" VARCHAR(15) NOT NULL,
  "address" TEXT NOT NULL,
  "created_at" TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  "updated_at" TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE "borrowings" (
  "id" UUID PRIMARY KEY,
  "book_id" UUID NOT NULL,
  "member_id" UUID NOT NULL,
  "borrow_date" DATE NOT NULL,
  "return_date" DATE,
  "status" status DEFAULT 'BORROWED',
  "created_at" TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  "updated_at" TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);


ALTER TABLE "borrowings" ADD FOREIGN KEY ("book_id") REFERENCES "books" ("id");
ALTER TABLE "borrowings" ADD FOREIGN KEY ("member_id") REFERENCES "members" ("id");

CREATE TRIGGER set_updated_at_books
BEFORE UPDATE ON books
FOR EACH ROW
EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER set_updated_at_members
BEFORE UPDATE ON members
FOR EACH ROW
EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER set_updated_at_borrowings
BEFORE UPDATE ON borrowings
FOR EACH ROW
EXECUTE FUNCTION update_updated_at_column();

INSERT INTO
	"books" ("id", "title", "author", "published_year", "stock", "isbn")
VALUES
	('9e718d75-8ede-41ee-b61f-e2b9f566a9bc', 'The Great Gatsby', 'F. Scott Fitzgerald', 1925, 5, '9780743273565'),
	('0b6cce0b-cecf-4ced-87d6-703671e413dc', 'To Kill a Mockingbird', 'Harper Lee', 1960, 3, '9780446310789'),
	('1245758f-e228-401b-8b04-171979fdd592', '1984', 'George Orwell', 1949, 4, '9780451524935'),
	('85e02293-b59b-4705-83d0-fda0ad1845d7', 'Pride and Prejudice', 'Jane Austen', 1813, 6, '9780141439518'),
	('093c5c56-f471-41e5-84b3-9e9ed75a1f85', 'The Catcher in the Rye', 'J.D. Salinger', 1951, 3, '9780316769488'),
	('84279733-8416-4c60-a806-ba3c948191bf', 'The Hobbit', 'J.R.R. Tolkien', 1937, 7, '9780547928227'),
	('4f4c23b2-8be7-421e-92f3-8826a20fda25', 'The Da Vinci Code', 'Dan Brown', 2003, 4, '9780307474278'),
	('27d0a5b6-359a-4a3f-8351-d2fdc1c63d99', 'The Alchemist', 'Paulo Coelho', 1988, 5, '9780062315007'),
	('6f60f63e-51b6-4764-9169-53cc89877a42', 'The Little Prince', 'Antoine de Saint-Exupéry', 1943, 8, '9780156012195'),
	('d480aa86-835b-42d7-a54f-7b137e5f944d', 'Brave New World', 'Aldous Huxley', 1932, 4, '9780060850524'),
	('54e1386f-3f2e-4683-9782-c6a044b8f326', 'The Lord of the Rings', 'J.R.R. Tolkien', 1954, 6, '9780618640157'),
	('2498d3e8-5062-4294-a653-5e9f34740580', 'Harry Potter and the Sorcerer''s Stone', 'J.K. Rowling', 1997, 7, '9780590353427'),
	('25b9eac3-12b8-4f1d-9a72-96ae11c78950', 'The Chronicles of Narnia', 'C.S. Lewis', 1950, 5, '9780066238501'),
	('4d3a4ff4-0d32-4a2e-a4e3-98b839bd72f7', 'One Hundred Years of Solitude', 'Gabriel García Márquez', 1967, 3, '9780060883287'),
	('6773f0d6-c04e-4b13-b6a4-4b8cf405be09', 'The Hunger Games', 'Suzanne Collins', 2008, 6, '9780439023481'),
	('04f50ecd-5c62-4afe-bb65-c08794ead9cf', 'The Road', 'Cormac McCarthy', 2006, 4, '9780307387899'),
	('a4c82848-2708-4823-997e-60b0263f45f9', 'The Kite Runner', 'Khaled Hosseini', 2003, 5, '9781594631931'),
	('dfcef4b7-b4a8-48b7-8bbe-ee451697fa62', 'The Girl with the Dragon Tattoo', 'Stieg Larsson', 2005, 4, '9780307949486'),
	('9d9757b4-cba7-420d-b5b9-d84c19fa93ab', 'The Book Thief', 'Markus Zusak', 2005, 6, '9780375842207'),
	('ac8b97c1-0dfa-4434-b694-cf66345b7774', 'Life of Pi', 'Yann Martel', 2001, 5, '9780156027328');

INSERT INTO
	"members" ("id", "name", "email", "phone", "address")
VALUES
	('53f0b928-9abe-4cc1-a40f-ffbeed04090c', 'John Doe', 'john.doe@email.com', '081234567890', '123 Main St, City'),
	('e233bb83-ff06-4d8e-a6c6-256e7cca0523', 'Jane Smith', 'jane.smith@email.com', '081234567891', '456 Oak Ave, Town'),
	('c610a198-c180-4bc7-9e41-e9ff16f2ec14', 'Robert Johnson', 'robert.j@email.com', '081234567892', '789 Pine Rd, Village'),
	('662bc22f-4d7e-4c99-ac86-4ea9e175a458', 'Mary Williams', 'mary.w@email.com', '081234567893', '321 Elm St, Borough'),
	('977f30ba-8d4c-41c8-8551-8e8a61dc3e97', 'Michael Brown', 'michael.b@email.com', '081234567894', '654 Maple Dr, District'),
	('5e70ace2-db44-457d-b380-ed4f286b9ed3', 'Sarah Davis', 'sarah.d@email.com', '081234567895', '987 Cedar Ln, County'),
	('f57b5080-ee2a-4a7d-a07a-94a25ab8adb8', 'James Wilson', 'james.w@email.com', '081234567896', '147 Birch Ave, State'),
	('aeeb2e3a-6324-43b2-8f1e-273ded8c12ec', 'Emily Taylor', 'emily.t@email.com', '081234567897', '258 Spruce St, Province'),
	('b86f7983-c179-4591-a63d-80e0c8e07b44', 'David Anderson', 'david.a@email.com', '081234567898', '369 Ash Rd, Territory'),
	('e1aea709-3263-49eb-8fa0-37b0ac0f8181', 'Lisa Thomas', 'lisa.t@email.com', '081234567899', '741 Walnut Ct, Region'),
	('c7c937f3-efc8-44c9-a608-457dc49bc8de', 'Kevin Martin', 'kevin.m@email.com', '081234567800', '852 Cherry Ln, Area'),
	('fd2dfcc1-1ac9-47c9-890e-ec00ec4d5896', 'Jennifer White', 'jennifer.w@email.com', '081234567801', '963 Palm Ave, Zone'),
	('738dfdca-5868-4bad-b920-ff28393881e8', 'Christopher Lee', 'chris.l@email.com', '081234567802', '159 Beach Rd, Sector'),
	('2eba62fa-8ca3-4441-807e-31b48d1ef4b4', 'Amanda Clark', 'amanda.c@email.com', '081234567803', '357 Coast St, District'),
	('e868c4e1-5996-48f2-8e56-78f202db84b6', 'Daniel Martinez', 'daniel.m@email.com', '081234567804', '468 River Dr, County'),
	('97371d23-fb78-4de5-a22c-5b54bc90d7bc', 'Michelle Garcia', 'michelle.g@email.com', '081234567805', '789 Lake Ave, State'),
	('82f1a359-5754-4e50-a2b7-610c7dd61b6c', 'Andrew Robinson', 'andrew.r@email.com', '081234567806', '951 Ocean Blvd, Province'),
	('011d9fa2-1812-40e8-8eea-e7f902e783ab', 'Patricia Rodriguez', 'patricia.r@email.com', '081234567807', '753 Bay St, Territory'),
	('9d053d30-c4a3-49ae-8c7d-eeaee36f6530', 'Joseph Hall', 'joseph.h@email.com', '081234567808', '246 Harbor Rd, Region'),
	('8fdc38fb-4008-4e16-bdb4-f2c08e0bf971', 'Nicole King', 'nicole.k@email.com', '081234567809', '135 Port Ave, Area');

INSERT INTO
	"borrowings" ("id", "book_id", "member_id", "borrow_date", "return_date", "status")
VALUES
	('811d64a5-a2fb-4c0b-be26-4cd852c98e0d', '9e718d75-8ede-41ee-b61f-e2b9f566a9bc', '53f0b928-9abe-4cc1-a40f-ffbeed04090c', '2024-11-21', '2024-11-28', 'RETURNED'),
	('b7a970bb-bfa8-4dfe-991e-fe5c7174b909', '0b6cce0b-cecf-4ced-87d6-703671e413dc', 'e233bb83-ff06-4d8e-a6c6-256e7cca0523', '2024-11-22', '2024-11-29', 'RETURNED'),
	('8b5f7735-978e-4a21-8b14-3006c46b4c4c', '1245758f-e228-401b-8b04-171979fdd592', 'c610a198-c180-4bc7-9e41-e9ff16f2ec14', '2024-11-23', '2024-11-30', 'RETURNED'),
	('0000b278-4990-471b-8d1f-5bb265cda4a5', '84279733-8416-4c60-a806-ba3c948191bf', '5e70ace2-db44-457d-b380-ed4f286b9ed3', '2024-11-26', '2024-12-03', 'RETURNED'),
	('2120e0e3-8e10-42c1-b5a5-33b2536e307e', '27d0a5b6-359a-4a3f-8351-d2fdc1c63d99', 'aeeb2e3a-6324-43b2-8f1e-273ded8c12ec', '2024-11-28', '2024-12-05', 'RETURNED'),
	('08ce0463-96ad-4556-97dd-a12ef487b477', 'd480aa86-835b-42d7-a54f-7b137e5f944d', 'e1aea709-3263-49eb-8fa0-37b0ac0f8181', '2024-11-30', '2024-12-07', 'RETURNED'),
	('916f7651-d2c4-4b66-a364-a9590aad766b', '2498d3e8-5062-4294-a653-5e9f34740580', 'fd2dfcc1-1ac9-47c9-890e-ec00ec4d5896', '2024-12-02', '2024-12-09', 'RETURNED'),
	('bcaf2b64-708a-4ec0-ba6d-d9319f80a2a4', '4d3a4ff4-0d32-4a2e-a4e3-98b839bd72f7', '2eba62fa-8ca3-4441-807e-31b48d1ef4b4', '2024-12-04', '2024-12-11', 'RETURNED'),
	('a19385a0-982f-4d2b-90b4-b2b073d4778a', '04f50ecd-5c62-4afe-bb65-c08794ead9cf', '97371d23-fb78-4de5-a22c-5b54bc90d7bc', '2024-12-06', '2024-12-13', 'RETURNED'),
	('40200793-8ee4-4b36-a00b-77613ad17f5e', 'ac8b97c1-0dfa-4434-b694-cf66345b7774', '8fdc38fb-4008-4e16-bdb4-f2c08e0bf971', '2024-12-10', '2024-12-17', 'RETURNED'),
	('f4d73d15-db82-4883-81b3-e0f74cd7aa1c', '85e02293-b59b-4705-83d0-fda0ad1845d7', '662bc22f-4d7e-4c99-ac86-4ea9e175a458', '2024-11-24', NULL, 'BORROWED'),
	('13f0e40b-a900-4d7f-98e2-44181c3ca1dc', '093c5c56-f471-41e5-84b3-9e9ed75a1f85', '977f30ba-8d4c-41c8-8551-8e8a61dc3e97', '2024-11-25', NULL, 'BORROWED'),
	('55b56581-8e1c-430b-9b74-41da4deebd6f', '4f4c23b2-8be7-421e-92f3-8826a20fda25', 'f57b5080-ee2a-4a7d-a07a-94a25ab8adb8', '2024-11-27', NULL, 'BORROWED'),
	('094304a5-6f17-4f90-8dab-a5f51d8c0dc0', '6f60f63e-51b6-4764-9169-53cc89877a42', 'b86f7983-c179-4591-a63d-80e0c8e07b44', '2024-11-29', NULL, 'BORROWED'),
	('dd7059a5-eb60-4daa-81a5-5a944c29bb21', '54e1386f-3f2e-4683-9782-c6a044b8f326', 'c7c937f3-efc8-44c9-a608-457dc49bc8de', '2024-12-01', NULL, 'BORROWED'),
	('1e993b7b-5cfd-4f4d-bf59-e19a91bcf386', '25b9eac3-12b8-4f1d-9a72-96ae11c78950', '738dfdca-5868-4bad-b920-ff28393881e8', '2024-12-03', NULL, 'BORROWED'),
	('8f2219f3-d976-4348-851a-101bbdf55b7b', '6773f0d6-c04e-4b13-b6a4-4b8cf405be09', 'e868c4e1-5996-48f2-8e56-78f202db84b6', '2024-12-05', NULL, 'BORROWED'),
	('02505310-4a3c-4c34-809b-f79299a3b6c5', 'a4c82848-2708-4823-997e-60b0263f45f9', '82f1a359-5754-4e50-a2b7-610c7dd61b6c', '2024-12-07', NULL, 'BORROWED'),
	('35e73a4d-7c86-4381-b932-6409c0a9508c', 'dfcef4b7-b4a8-48b7-8bbe-ee451697fa62', '011d9fa2-1812-40e8-8eea-e7f902e783ab', '2024-12-08', NULL, 'BORROWED'),
	('fdde10d0-7d45-4590-b505-7b6e5d8955e5', '9d9757b4-cba7-420d-b5b9-d84c19fa93ab', '9d053d30-c4a3-49ae-8c7d-eeaee36f6530', '2024-12-09', NULL, 'BORROWED');