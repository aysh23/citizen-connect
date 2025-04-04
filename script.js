// script.js (improved version)
class ComplaintSystem {
    constructor() {
        this.complaints = [];
        this.form = document.getElementById('complaintForm');
        this.complaintList = document.getElementById('complaintList');
        this.totalComplaints = document.getElementById('totalComplaints');
        this.noComplaints = document.getElementById('noComplaints');
        this.refreshBtn = document.getElementById('refreshBtn');
        this.init();
    }

    init() {
        this.form.addEventListener('submit', (e) => this.handleSubmit(e));
        this.refreshBtn.addEventListener('click', () => this.renderComplaints());
        this.loadComplaints();
        this.updateUI();
    }

    handleSubmit(e) {
        e.preventDefault();
        
        const complaint = {
            id: Date.now(),
            name: document.getElementById('name').value,
            category: document.getElementById('category').value,
            description: document.getElementById('description').value,
            location: document.getElementById('location').value,
            status: 'Pending',
            date: new Date().toLocaleDateString(),
            department: this.assignDepartment(document.getElementById('category').value)
        };

        this.complaints.push(complaint);
        this.saveComplaints();
        this.renderComplaints();
        this.updateUI();
        this.form.reset();
        this.showNotification('Complaint submitted successfully!');
    }

    assignDepartment(category) {
        const departments = {
            electricity: 'Power Department',
            water: 'Water Supply Department',
            roads: 'Public Works Department',
            health: 'Health Department',
            other: 'General Administration'
        };
        return departments[category] || 'General Administration';
    }

    saveComplaints() {
        localStorage.setItem('complaints', JSON.stringify(this.complaints));
    }

    loadComplaints() {
        const saved = localStorage.getItem('complaints');
        if (saved) {
            this.complaints = JSON.parse(saved);
            this.renderComplaints();
        }
    }

    renderComplaints() {
        this.complaintList.innerHTML = '';
        if (this.complaints.length === 0) {
            this.noComplaints.style.display = 'block';
            return;
        }

        this.noComplaints.style.display = 'none';
        this.complaints.forEach(complaint => {
            const div = document.createElement('div');
            div.className = 'complaint-item';
            div.innerHTML = `
                <p><strong>ID:</strong> ${complaint.id}</p>
                <p><strong>Category:</strong> ${
                    complaint.category.charAt(0).toUpperCase() + complaint.category.slice(1)
                }</p>
                <p><strong>Issue:</strong> ${complaint.description}</p>
                <p><strong>Location:</strong> ${complaint.location}</p>
                <p><strong>Status:</strong> <span class="status-${complaint.status.toLowerCase()}">${complaint.status}</span></p>
                <p><strong>Department:</strong> ${complaint.department}</p>
                <p><strong>Date:</strong> ${complaint.date}</p>
            `;
            this.complaintList.appendChild(div);
        });
    }

    updateUI() {
        this.totalComplaints.textContent = this.complaints.length;
    }

    showNotification(message) {
        const notification = document.createElement('div');
        notification.className = 'notification';
        notification.textContent = message;
        document.body.appendChild(notification);
        
        setTimeout(() => {
            notification.remove();
        }, 3000);
    }
}

// Add notification and status styles
const style = document.createElement('style');
style.textContent = `
    .notification {
        position: fixed;
        top: 20px;
        right: 20px;
        padding: 15px 25px;
        background: rgba(0, 255, 0, 0.2);
        color: white;
        border-radius: 8px;
        backdrop-filter: blur(10px);
        border: 1px solid rgba(255, 255, 255, 0.2);
    }
    .status-pending {
        color: #ffcc00;
    }
    .status-inprogress {
        color: #00ccff;
    }
    .status-resolved {
        color: #00ff00;
    }
`;
document.head.appendChild(style);

const system = new ComplaintSystem();
