二进制分帧层：HTTP2是二进制协议，他采用二进制格式传输数据。HTTP2.0将响应划分成了两个帧，分为HEADERS(首部)和DATA(消息负载)

多路复用：可以解决HTTP1中线头阻塞和多个TCP连接的问题，HTTP2让所有的请求在一个TCP连接上完成，真正的实现了请求的并发。HTTP2建立一个TCP连接，一个连接上面可以有任意多个流（stream）

头部压缩：在1.X版本中，首部用文本格式传输，通常会给每个传输增加500-800字节的开销。而每个请求带的一些首部字段都是相同的，例如cookie、user-agent等。HTTP2为此采用HPACK压缩格式来压缩首部。

服务端推送：服务器端推送使得服务器可以预测客户端需要的资源，主动推送到客户端。