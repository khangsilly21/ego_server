const express = require('express');
const cors = require('cors');
const WebSocket = require('ws');
const port = process.env.PORT || 3001;
// Dữ liệu các xe (cars) sẽ lưu trữ trong bộ nhớ
  const cars=[
        {
            id:1,title:'Tuyến A1-Xe 01',numberStudent:10,numberStudentAbsent:0,numberStudentOnLeave:0,state:'Chưa xuất phát',
            students:[{stt:1,name:'Luu Thinh Khang',class:'9C'},{stt:2,name:'Nguyễn văn An',class:'9A'},{stt:3,name:'Nguyễn văn An',class:'9A'},{stt:4,name:'Nguyễn văn An',class:'9A'},{stt:5,name:'Nguyễn văn An',class:'9A'},{stt:6,name:'Nguyễn văn An',class:'9A'},{stt:7,name:'Nguyễn văn An',class:'9A'},{stt:8,name:'Nguyễn văn An',class:'9A'},{stt:9,name:'Nguyễn văn An',class:'9A'},{stt:10,name:'Nguyễn văn An',class:'9A'}]
        },
        {
            id:2,title:'Tuyến B2- Xe 02',numberStudent:10,numberStudentAbsent:0,numberStudentOnLeave:0,state:'Chưa xuất phát',
            students:[{stt:1,name:'pav',class:'9C'},{stt:2,name:'Nguyễn văn An',class:'9A'},{stt:3,name:'Nguyễn văn An',class:'9A'},{stt:4,name:'Nguyễn văn An',class:'9A'},{stt:5,name:'Nguyễn văn An',class:'9A'},{stt:6,name:'Nguyễn văn An',class:'9A'},{stt:7,name:'Nguyễn văn An',class:'9A'},{stt:8,name:'Nguyễn văn An',class:'9A'},{stt:9,name:'Nguyễn văn An',class:'9A'},{stt:10,name:'Nguyễn văn An',class:'9A'}]
        },
        {
            id:3,title:'Tuyến C3-Xe 03',numberStudent:0,numberStudentAbsent:0,numberStudentOnLeave:0,state:'Chưa vận hành',
             students:[]
        },
        {
          id:4,title:'Tuyến XX - Xe 00',numberStudent:0,numberStudentAbsent:0,numberStudentOnLeave:0,state:'Chưa vận hành',
          students:[]
      }, {
        id:5,title:'Tuyến XX - Xe 00',numberStudent:0,numberStudentAbsent:0,numberStudentOnLeave:0,state:'Chưa vận hành',
        students:[]
    }, {
      id:6,title:'Tuyến XX - Xe 00',numberStudent:0,numberStudentAbsent:0,numberStudentOnLeave:0,state:'Chưa vận hành',
      students:[]
  }, {
    id:7,title:'Tuyến XX - Xe 00',numberStudent:0,numberStudentAbsent:0,numberStudentOnLeave:0,state:'Chưa vận hành',
    students:[]
}, {
  id:8,title:'Tuyến XX - Xe 00',numberStudent:0,numberStudentAbsent:0,numberStudentOnLeave:0,state:'Chưa vận hành',
  students:[]
}, {
  id:9,title:'Tuyến XX - Xe 00',numberStudent:0,numberStudentAbsent:0,numberStudentOnLeave:0,state:'Chưa vận hành',
  students:[]
}, {
  id:10,title:'Tuyến XX - Xe 00',numberStudent:0,numberStudentAbsent:0,numberStudentOnLeave:0,state:'Chưa vận hành',
  students:[]
}, {
  id:11,title:'Tuyến XX - Xe 00',numberStudent:0,numberStudentAbsent:0,numberStudentOnLeave:0,state:'Chưa vận hành',
  students:[]
}, {
  id:12,title:'Tuyến XX - Xe 00',numberStudent:0,numberStudentAbsent:0,numberStudentOnLeave:0,state:'Chưa vận hành',
  students:[]
}
    ]

// Khởi tạo Express server
const app = express();
app.use(cors());
app.use(express.json());

// WebSocket Server
const wss = new WebSocket.Server({ noServer: true });

// Broadcast cập nhật cho các client
const broadcastUpdate = () => {
  const data = JSON.stringify({ type: 'UPDATE_CARS', payload: cars });
  wss.clients.forEach((client) => {
    if (client.readyState === WebSocket.OPEN) {
      client.send(data);
    }
  });
};

app.get('/', (req, res) => {
  res.send('Welcome to the Car WebSocket Server');
});

// API để lấy thông tin các xe
app.get('/cars', (req, res) => {
  res.json(cars);
});

// API để cập nhật điểm danh
app.put('/cars/:id/students/:studentId', (req, res) => {
  const { id, studentId } = req.params;
  const { checkinTime, checkoutTime, absent } = req.body; // <-- Thêm thuộc tính absent

  // Tìm xe cần cập nhật
  const car = cars.find((c) => c.id == id);
  if (car) {
    const student = car.students.find((s) => s.stt == studentId);
    if (student) {
      // Cập nhật trạng thái checkinTime, checkoutTime, absent nếu có
      student.checkinTime = checkinTime || student.checkinTime;
      student.checkoutTime = checkoutTime || student.checkoutTime;
      student.absent = absent !== undefined ? absent : student.absent; // <-- Cập nhật trạng thái absent

      // Gửi thông điệp cập nhật tới các client
      broadcastUpdate();
      return res.status(200).json({ message: 'Cập nhật thành công', car });
    }
  }
  res.status(404).json({ message: 'Không tìm thấy xe hoặc học sinh' });
});

// API để cập nhật trạng thái xe
app.put('/cars/:id', (req, res) => {
  const { id } = req.params;
  const { state } = req.body;

  // Tìm xe cần cập nhật
  const car = cars.find((c) => c.id == id);
  if (car) {
    car.state = state || car.state;

    // Gửi thông điệp cập nhật tới các client
    broadcastUpdate();
    return res.status(200).json({ message: 'Cập nhật trạng thái thành công', car });
  }
  res.status(404).json({ message: 'Không tìm thấy xe' });
});


// Cấu hình WebSocket
const server = app.listen(port, () => {
  console.log('Server đang chạy tại http://localhost:3001');
});

server.on('upgrade', (request, socket, head) => {
  wss.handleUpgrade(request, socket, head, (ws) => {
    wss.emit('connection', ws, request);
  });
});
