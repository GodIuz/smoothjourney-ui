import { Component, inject, OnInit } from '@angular/core';
import { UserService } from '../../services/user-service.service';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-users',
  imports: [CommonModule, FormsModule],
  templateUrl: './users.component.html',
  styleUrl: './users.component.css',
})
export class UsersComponent implements OnInit {
  private userService = inject(UserService);

  users: any[] = [];
  selectedUser: any = null;
  isLoading = false;
  editingUser: any = null;

  ngOnInit() {
    this.loadUsers();
  }

  loadUsers() {
    this.isLoading = true;
    this.userService.getAllUsers().subscribe({
      next: (data) => {
        this.users = data;
        this.isLoading = false;
      },
      error: (err) => {
        console.error('Error:', err);
        this.isLoading = false;
      },
    });
  }

  openEditModal(user: any) {
    this.editingUser = { ...user };
  }

  closeEditModal() {
    this.editingUser = null;
  }

  saveUser() {
    if (!this.editingUser) return;

    this.userService
      .updateUser(this.editingUser.userId, this.editingUser)
      .subscribe({
        next: () => {
          const index = this.users.findIndex(
            (u) => u.userId === this.editingUser.userId,
          );
          if (index !== -1) {
            this.users[index] = { ...this.editingUser };
          }
          alert('Τα στοιχεία ενημερώθηκαν!');
          this.closeEditModal();
        },
        error: (err) => {
          console.error(err);
          alert('Σφάλμα κατά την ενημέρωση.');
        },
      });
  }

  makeAdmin(user: any) {
    if (
      confirm(
        `Είστε σίγουρος ότι θέλετε να κάνετε Admin τον/την ${user.userName};`,
      )
    ) {
      this.userService.promoteToAdmin(user.userId).subscribe({
        next: () => {
          user.role = 'Admin';
          alert(`Ο χρήστης ${user.userName} είναι πλέον Admin!`);
        },
        error: (err) => alert('Κάτι πήγε στραβά με την αναβάθμιση.'),
      });
    }
  }

  onDelete(id: number) {
    if (confirm('Διαγραφή χρήστη;')) {
      this.userService.deleteUser(id.toString()).subscribe({
        next: () => {
          this.users = this.users.filter((u) => u.userId !== id);
        },
        error: () => alert('Σφάλμα διαγραφής.'),
      });
    }
  }
}
