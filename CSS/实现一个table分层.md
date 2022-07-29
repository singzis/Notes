# table分层

<img src="/Users/zhouxing/workspace/Notes/images/table.png" alt="img" style="zoom:50%;" />

```css
.div-th {
  display: flex;
  flex-direction: column;
  width: 100px;
  background: linear-gradient(
    to top right,
    rgba(0, 0, 0, 0) 0%,
    rgba(0, 0, 0, 0) calc(50% - 1.5px),
    rgba(0, 0, 0, 1) 50%,
    rgba(0, 0, 0, 0) calc(50% + 1.5px),
    rgba(0, 0, 0, 0) 100%
  );
}

.div-th > span:first-child {
  align-self: flex-end;
}

.div-th > span:last-child {
  align-self: flex-start;
}
```



```html
<table border="1" cellspacing="0">
  <thead>
    <tr>
      <th class="div-th">
        <span>A1</span>
        <span>A2</span>
      </th>
      <th>B</th>
    </tr>
  </thead>
  <tbody>
    <tr>
      <td>1</td>
      <td>2</td>
    </tr>
  </tbody>
</table>
```

