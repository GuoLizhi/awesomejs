BFS常见的场景：从一副图中，找到从起点start到终点target的最近距离。算法通用模板：

```java
public int BFS(Node start, Node end) {
  Queue<Node> q; // 核心数据结构
  Set<Node> visited; // 标记是否已经走过，避免走回头路
  
  q.offer(start); // 将起点加入队列
  visited.add(start); // 将起点标记为已访问过
  int step = 0;
  
  while (!q.isEmpty()) {
    int sz = q.size()
    // 将当前队列中所有的节点向四周扩散
    for (int i = 0; i < sz; i++) {
      Node curr = q.poll();
      // 重点：这里判断是否到达重点
      if (curr is target) {
        return step;
      }
      // 将curr的相邻节点加入队列
      // cur.adj()泛指cur的临近节点
      for (Node x: cur.adj()) {
        // 还要判断x未被访问过
        if (x is not visited) {
          q.offer(x);
          visited.add(x);
        }
      }
      step++;
    }
  }
}
```

