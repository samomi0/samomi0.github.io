---
title: CPU内存监控
date: 2023-12-21
weight: 2
---

利用psutil和matplotlib实现对指定进程的资源监控，并画图保存

<!--more-->

## 设置pip默认源

~~~shell
sudo apt-get install python3-pip
~~~

[清华源](https://mirrors.tuna.tsinghua.edu.cn/help/pypi/)

## 依赖

~~~shell
pip3 install psutil matplotlib -i https://pypi.tuna.tsinghua.edu.cn/simple
~~~

## code

~~~python
import psutil
import time
import argparse
import logging

def parse_arguments():
    parser = argparse.ArgumentParser()
    parser.add_argument("-p", "--pid", help="pid of target", type=int)
    parser.add_argument("-d", "--duration", default=10, help="Duration Time", type=int)
    parser.add_argument("-i", "--interval", default=1, help="interval", type=int)
    parser.add_argument("--save_image", default=False, help="save image?", type=bool)
    args = parser.parse_args()

    if not args.pid:
        print("Please set pid")
        exit(1)

    return args

class Monitor:
    _process_id = 1
    _timestamps = []
    _memory_usage = []
    _cpu_usage = []

    def save_usage_image(self):
        import matplotlib.pyplot as plt

        # 绘制内存使用率图表
        plt.figure(1)
        plt.plot(self._timestamps, self._memory_usage)
        plt.xlabel('time(s)')
        plt.ylabel('Memory(MB)')
        plt.title('Usage')
        plt.grid(True)

        # 保存图表
        plt.savefig("memory_usage_plot_" + str(self._process_id) + ".png")

        # 绘制CPU使用率图表
        plt.figure(2)
        plt.plot(self.timestamps, self._cpu_usage)
        plt.xlabel('time(s)')
        plt.ylabel('CPU(%)')
        plt.title('CPU Usage')
        plt.grid(True)

        # 保存图表
        plt.savefig("cpu_usage_plot_" + str(self._process_id) + ".png")

    def process(self, duration, interval):
        start_time = time.time()

        while time.time() - start_time <= duration:
            cur_time = time.time() - start_time
            try:
                process = psutil.Process(process_id)
                mem_info = process.memory_info()
                cur_mem_usage = mem_info.rss / (1024 * 1024) # 单位：MB
                self._memory_usage.append(cur_mem_usage)  

                cpu_percent = process.cpu_percent(interval=interval)
                self._cpu_usage.append(cpu_percent)

                logging.info(f"Memory usage: {cur_mem_usage:.6f}MB, CPU usage: {cpu_percent}%")

                self._timestamps.append(cur_time)
            except psutil.NoSuchProcess:
                logging.warn(f"进程ID {process_id} 不存在或已终止。")
                break

if __name__ == "__main__":
    args = parse_arguments()

    process_id = args.pid
    duration = args.duration
    interval = args.interval

    log_file_name = str(process_id) + ".log"
    logging.basicConfig(level=logging.DEBUG,
                        format='%(asctime)s - %(levelname)s - %(message)s',
                        filename=log_file_name)

    monitor = Monitor()
    monitor.process(duration, interval)

    if args.save_image:
        monitor.save_usage_image()
        
~~~