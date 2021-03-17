### 1. HTTP状态码301和302的区别

- 301表示永久重定向，当前访问的资源已经被永久移除。以后都不应该访问这个资源，搜索引擎也会用新的地址代替老的地址。可以在响应首部的`location`字段返回最新的地址。比如访问`http://baidu.com`会被永久重定向到`https://baidu.com`
- 302表示临时重定向，当前访问的资源只是暂时访问不了，过段时间可能可以继续访问，通常用于权限控制。比如某个资源需要会员权限才可以被访问。

### 2. TCP流量控制

对于发送端和接收端而言，TCP需要将发送的数据放到发送缓冲区，将接收的数据放到接收缓冲区。流量控制的原理就是通过接收缓冲区的大小来控制发送端的发送。如果接收缓冲区满了，发送端就不再发送了。

TCP滑动窗口分为发送窗口和接收窗口。

### 3. 拥塞控制

拥塞控制的原因可能是整个网络环境特别差，容易丢包，那么发送端就应该注意了。主要有3种方法：

1. 慢启动阈值+拥塞避免

对于拥塞控制来说，TCP主要维护两个核心状态：`拥塞窗口`和`慢启动阈值`

在发送端使用拥塞窗口来控制发送窗口的大小，然后采用一种比较保守的慢启动算法来慢慢适应这个网络。开始传输的一段时间，发送端和接收端会首先通过三次握手建立连接，确定各自接收窗口大小，然后初始化双方的拥塞窗口，接着每经过一轮 RTT（收发时延），拥塞窗口大小翻倍，直到达到慢启动阈值。然后开始进行拥塞避免，拥塞避免具体的做法就是之前每一轮 RTT，拥塞窗口翻倍，现在每一轮就加一个。

2. 快速重传

在 TCP 传输过程中，如果发生了丢包，接收端就会发送之前重复 ACK，比如 第 5 个包丢了，6、7 达到，然后接收端会为 5，6，7 都发送第四个包的 ACK，这个时候发送端受到了 3 个重复的 ACK，意识到丢包了，就会马上进行重传，而不用等到 RTO （超时重传的时间）

3. 快速恢复