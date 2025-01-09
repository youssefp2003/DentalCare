# **DentFlow**  

## **Overview**  
DentFlow is a state-of-the-art dental clinic management system crafted to enhance operational efficiency, simplify appointment scheduling, and improve patient care. With DentFlow, managing patient records, planning treatments, handling billing, and more becomes a seamless experience.  

---

## **Features**  

### **Patient Management**  
- Store and maintain detailed patient profiles, including personal data, medical history, and treatment records.  

### **Appointment Scheduling**  
- Utilize a user-friendly, calendar-based system to schedule, reschedule, and manage appointments.  

### **Treatment Planning**  
- Create, track, and modify comprehensive treatment plans tailored to individual patients.  

### **Medical Records Management**  
- Digitally manage X-rays, diagnoses, and detailed medical records for streamlined workflows.  

### **Billing and Invoicing**  
- Generate detailed invoices and manage payments with integrated billing functionality.  

### **Prescription Management**  
- Efficiently create, store, and manage patient prescriptions.  

---

## **Technologies Used**  

### **Frontend**  
- **React.js**: Frontend framework for building interactive user interfaces.  
- **Tailwind CSS**: Styling and UI component framework.  
- **Redux**: State management for complex application state.  
- **Axios**: Simplified HTTP requests for API integration.  

### **Backend**  
- **Java 17**: Backend programming language.  
- **Spring Boot**: Framework for building RESTful services.  
- **Spring Security**: Authentication and authorization.  
- **Spring Data JPA**: Database interaction with ease.  
- **Hibernate**: ORM for managing database persistence.  
- **Maven**: Dependency and build management.  

### **Database**  
- **PostgreSQL**: Relational database management system.  
- **Liquibase**: Database schema version control.  

---

## **Getting Started**  

### **Prerequisites**  
Ensure your system has the following:  
- **JDK 17** or higher  
- **Maven 3.8+**  
- **PostgreSQL 14+**  
- **Node.js v14.0.0+**  
- **npm v6.0.0+**  

---

### **Installation Steps**  

1. **Clone the Repository**  
   ```bash  
   git clone https://github.com/yourusername/DentFlow.git  
   cd DentFlow  
   ```  

2. **Database Setup**  
   Open PostgreSQL and create the database:  
   ```sql  
   CREATE DATABASE dentflow;  
   ```  

3. **Configure Backend**  
   Edit the `src/main/resources/application.properties` file to match your database configuration:  
   ```properties  
   spring.datasource.url=jdbc:postgresql://localhost:5432/dentflow  
   spring.datasource.username=your_username  
   spring.datasource.password=your_password  
   spring.jpa.hibernate.ddl-auto=update  
   ```  

4. **Build and Run Backend**  
   Navigate to the backend directory and run the following commands:  
   ```bash  
   cd backend  
   mvn clean install  
   mvn spring-boot:run  
   ```  

5. **Install Frontend Dependencies**  
   Navigate to the frontend directory and install the required dependencies:  
   ```bash  
   cd ../frontend  
   npm install  
   ```  

6. **Configure Frontend Environment**  
   Create a `.env` file in the frontend directory with the following content:  
   ```env  
   REACT_APP_API_URL=http://localhost:8080/api  
   ```  

7. **Run Frontend Application**  
   Start the frontend development server:  
   ```bash  
   npm start  
   ```  

8. **Access DentFlow**  
   Open your browser and navigate to:  
   [http://localhost:3000](http://localhost:3000)  

---

## **Project Structure**  

```plaintext  
DentFlow/  
├── frontend/                # Frontend application files  
│   ├── src/                # React source files  
│   ├── public/             # Public assets (static files)  
│   └── package.json        # Frontend dependencies  
├── backend/                # Backend application files  
│   ├── src/  
│   │   ├── main/  
│   │   │   ├── java/      # Java source files  
│   │   │   │   ├── controllers/   # RESTful API endpoints  
│   │   │   │   ├── models/        # Entity classes  
│   │   │   │   ├── repositories/  # Data access objects  
│   │   │   │   ├── services/      # Business logic  
│   │   │   │   └── security/      # Security configurations  
│   │   │   └── resources/         # Configuration files  
│   │   └── test/                  # Unit and integration tests  
│   └── pom.xml                   # Maven dependencies  
├── database/                     # Database migrations and schemas  
├── docs/                         # Documentation files  
```  

---

## **Contributing**  

Contributions are welcome! Follow these steps to contribute:  

1. **Fork the Repository**  
2. **Create a Feature Branch**:  
   ```bash  
   git checkout -b feature/YourFeatureName  
   ```  
3. **Commit Your Changes**:  
   ```bash  
   git commit -m "Add YourFeatureName"  
   ```  
4. **Push to the Branch**:  
   ```bash  
   git push origin feature/YourFeatureName  
   ```  
5. **Submit a Pull Request**  

---

## **License**  

This project is licensed under the **MIT License**. For more details, see the `LICENSE` file.  
 
