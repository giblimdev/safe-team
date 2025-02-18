/*


generator client {
  provider = "prisma-client-js"
}

datasource db {
  provider = "postgresql"
  url      = env("DATABASE_URL")
}

model Idea {
  id              String           @id @default(cuid())
  functionalities Functionality[]
}

model Functionality {
  id                String              @id @default(cuid())
  devId             String
  content           String
  functionalityItems FunctionalityItem[]

  Idea Idea[]
}

model FunctionalityItem {
  id      String   @id @default(cuid())
  item    String

  Functionality Functionality[]
}

model User {
  id          String      @id @default(cuid())
  pseudo      String?     @db.VarChar(255)
  email       String      @unique @db.VarChar(255)
  password    String      @db.VarChar(255)
  role        Role        @default(USER)
  createdAt   DateTime    @default(now())
  updatedAt   DateTime    @updatedAt
  company     String
  trainings   Training[]
}

enum Role {
  USER
  MANAGER
  ADMIN
}

model Company {
  id              String           @id @default(cuid())
  name            String
  employees       Employee[]
  companyCertifs  CompanyCertif[]
}

model Employee {
  id              String           @id @default(cuid())
  name            String
  email           String           @unique
  companyId       String
  company         Company          @relation(fields: [companyId], references: [id])
  progress        Progress[]
  employeeCertifs EmployeeCertif[]

  CompanyCertif CompanyCertif[]
}

model Training {
  id        String    @id @default(cuid())
  title     String
  modules   Module[]

  User User[]
}

model Module {
  id          String    @id @default(cuid())
  title       String
  chapters    Chapter[]
  trainingId  String
  training    Training  @relation(fields: [trainingId], references: [id])
}

model Chapter {
  id        String    @id @default(cuid())
  title     String
  moduleId  String
  module    Module    @relation(fields: [moduleId], references: [id])

  Progress Progress[]
}

model Progress {
  id          String    @id @default(cuid())
  employeeId  String
  employee    Employee  @relation(fields: [employeeId], references: [id])
  chapterId   String
  chapter     Chapter   @relation(fields: [chapterId], references: [id])
  completed   Boolean   @default(false)
}

model EmployeeCertif {
  id            String    @id @default(cuid())
  issuedDate    DateTime  @default(now())
  revisionDate  DateTime
  softExpirDate DateTime
  hardExpirDate DateTime
  badgeImg      String
  employeeId    String
  employee      Employee  @relation(fields: [employeeId], references: [id])
}

model CompanyCertif {
  id            String    @id @default(cuid())
  issuedDate    DateTime  @default(now())
  revisionDate  DateTime
  softExpirDate DateTime
  hardExpirDate DateTime
  badgeImg      String
  employeeId    String
  employee      Employee  @relation(fields: [employeeId], references: [id])
  companyId     String
  company       Company   @relation(fields: [companyId], references: [id])
}

model Badge {
  id              String    @id @default(cuid())
  activBadge      String
  warningBadge    String
  deprecatedBadge String
}








*/