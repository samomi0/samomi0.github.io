---
title: 共享内存
date: 2024-07-14
weight: 1
---

进程间共享内存

<!--more-->

## 创建

~~~c++
#include <fcntl.h>
#include <sys/mman.h>
#include <unistd.h>
#include <sys/stat.h> 
#include <iostream>

int main() {
    const char *name = "/my_shared_memory";
    const size_t SIZE = 4096;  // 大小为4KB

    int shm_fd = shm_open(name, O_CREAT | O_RDWR, 0666);
    if (shm_fd == -1) {
        std::cerr << "shm_open failed\n";
        return 1;
    }

    if (ftruncate(shm_fd, SIZE) == -1) {
        std::cerr << "ftruncate failed\n";
        return 1;
    }

    void *ptr = mmap(0, SIZE, PROT_READ | PROT_WRITE, MAP_SHARED, shm_fd, 0);
    if (ptr == MAP_FAILED) {
        std::cerr << "mmap failed\n";
        return 1;
    }

    std::cout << "Shared memory created and mapped successfully\n";

    return 0;
}

~~~

## 同步

~~~c++
#include <fcntl.h>
#include <sys/mman.h>
#include <unistd.h>
#include <sys/stat.h>
#include <iostream>
#include <semaphore.h>
#include <cstring>

const char *name = "/my_shared_memory";
const size_t SIZE = 4096;
const char *sem_name = "/my_semaphore";

int main() {
    sem_t *sem = sem_open(sem_name, O_CREAT, 0666, 1);
    if (sem == SEM_FAILED) {
        std::cerr << "sem_open failed\n";
        return 1;
    }

    int shm_fd = shm_open(name, O_CREAT | O_RDWR, 0666);
    if (shm_fd == -1) {
        std::cerr << "shm_open failed\n";
        return 1;
    }

    if (ftruncate(shm_fd, SIZE) == -1) {
        std::cerr << "ftruncate failed\n";
        return 1;
    }

    void *ptr = mmap(0, SIZE, PROT_READ | PROT_WRITE, MAP_SHARED, shm_fd, 0);
    if (ptr == MAP_FAILED) {
        std::cerr << "mmap failed\n";
        return 1;
    }

    sem_wait(sem);

    strcpy((char *)ptr, "Hello, shared memory!");

    sem_post(sem);

    return 0;
}
~~~