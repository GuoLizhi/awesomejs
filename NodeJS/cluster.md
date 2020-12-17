cluster模块允许设立一个主进程和若干个worker进程，由主进程监控和协调worker进程的运行。worker之间采用进程间通信交换消息。

```js
for (let i = 0; i < numCPUs; i++) {
  // 新建一个worker进程
  const worker = cluster.fork()
  // 该方法用于主进程中，向子进程发送消息
  worker.send(`在主进程中向${worker.process.pid}发送消息`)
}
```

worker.id 返回当前worker的独一无二的进程编号。

worker.process 所有的worker进程都是用child_process.fork()生成的。child_process.fork()返回的对象，就被保存在worker.process之中。通过这个属性，可以获取worker所在的进程对象。

worker.send() 该方法用于在主进程中，向子进程发送信息。

cluster模块主要方法

fork() 新建一个worker进程，上下文都复制主进程。只有主进程才能调用这个方法。

kill() 用于终止worker进程。它可以接受一个参数，表示系统信号。

listening事件 worker进程调用listening方法以后，“listening”事件就传向该进程的服务器，然后传向主进程。