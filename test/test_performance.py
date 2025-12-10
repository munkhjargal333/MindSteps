import time
import requests
import threading
import statistics


class PerformanceTester:
    def __init__(self, url, num_requests=10, concurrent_users=5):
        self.url = url
        self.num_requests = num_requests
        self.concurrent_users = concurrent_users
        self.response_times = []
        self.errors = 0
        self.lock = threading.Lock()  # Thread-safe counter & list

    def make_request(self):
        try:
            start_time = time.time()
            response = requests.get(self.url)
            end_time = time.time()

            with self.lock:
                if response.status_code == 200:
                    self.response_times.append(end_time - start_time)
                else:
                    self.errors += 1

        except Exception as e:
            with self.lock:
                self.errors += 1
            print(f"Error: {e}")

    def run_test(self):
        threads = []
        requests_per_user = self.num_requests // self.concurrent_users

        print(f"Starting performance test for {self.url}")
        print(f"Total requests: {self.num_requests}, Concurrent users: {self.concurrent_users}")

        start_test_time = time.time()

        for _ in range(self.concurrent_users):
            for _ in range(requests_per_user):
                thread = threading.Thread(target=self.make_request)
                threads.append(thread)
                thread.start()

        for thread in threads:
            thread.join()

        end_test_time = time.time()

        # Results
        total_time = end_test_time - start_test_time
        avg_response_time = statistics.mean(self.response_times) if self.response_times else 0
        min_time = min(self.response_times) if self.response_times else 0
        max_time = max(self.response_times) if self.response_times else 0

        print("\n=== Performance Test Results ===")
        print(f"Total test time: {total_time:.2f} seconds")
        print(f"Successful requests: {len(self.response_times)}")
        print(f"Failed requests: {self.errors}")
        print(f"Average response time: {avg_response_time:.3f} seconds")
        print(f"Min response time: {min_time:.3f} seconds")
        print(f"Max response time: {max_time:.3f} seconds")

        if total_time > 0:
            print(f"Requests per second: {len(self.response_times) / total_time:.2f}")
        else:
            print("Requests per second: N/A")


# Run
if __name__ == "__main__":
    tester = PerformanceTester("https://mind-steps-two.vercel.app", num_requests=20, concurrent_users=5)
    #tester = PerformanceTester("https://64.29.17.3", num_requests=10, concurrent_users=5)

    tester.run_test()
