import matplotlib.pyplot as plt
from datetime import datetime, timedelta

class ProgressReport:
    def __init__(self):
        self.sprints = [
            "Спринт 1", "Спринт 2", "Спринт 3", "Спринт 4", "Эцсийн спринт"
        ]
        self.planned_hours = [120, 100, 80, 60, 40]
        self.actual_hours = [110, 105, 85, 65, 35]
        self.velocity = [85, 90, 95, 100, 105]  # Хүчин чадлын өсөлт %

    def generate_burndown_chart(self):
        # Хугацааны цуваа (optional)
        dates = [datetime(2024, 1, 15) + timedelta(days=7 * i) for i in range(len(self.sprints))]

        plt.figure(figsize=(12, 6))

        # -----------------------------
        # 1) Burndown Chart
        # -----------------------------
        plt.subplot(1, 2, 1)
        plt.plot(self.sprints, self.planned_hours, "b-", label="Төлөвлөсөн", marker="o")
        plt.plot(self.sprints, self.actual_hours, "r-", label="Бодит", marker="s")

        plt.title("Burndown Chart - Цагийн хэрэглээ")
        plt.xlabel("Спринтууд")
        plt.ylabel("Цаг (цаг)")
        plt.legend()
        plt.xticks(rotation=45)
        plt.grid(True)

        # -----------------------------
        # 2) Velocity Chart
        # -----------------------------
        plt.subplot(1, 2, 2)
        plt.bar(self.sprints, self.velocity, color="green", alpha=0.7)

        plt.title("Багийн Velocity")
        plt.xlabel("Спринтууд")
        plt.ylabel("Хүчин чадал (%)")
        plt.xticks(rotation=45)
        plt.grid(True, axis="y")

        plt.tight_layout()
        plt.savefig("progress_report.png", dpi=300, bbox_inches="tight")
        plt.show()

    def print_summary(self):
        print("=== АХИЦ ДЭВШЛИЙН ТАЙЛАН ===")
        print(f"Нийт төлөвлөсөн цаг: {sum(self.planned_hours)} цаг")
        print(f"Нийт бодит цаг: {sum(self.actual_hours)} цаг")
        print(f"Цагийн хазайлт: {sum(self.actual_hours) - sum(self.planned_hours)} цаг")

        velocity_growth = self.velocity[-1] - self.velocity[0]
        print(f"Хүчин чадлын өсөлт: {velocity_growth}%")

        efficiency = (sum(self.planned_hours) / sum(self.actual_hours)) * 100
        print(f"Үр ашиг: {efficiency:.1f}%")

if __name__ == "__main__":
    report = ProgressReport()
    report.generate_burndown_chart()
    report.print_summary()
