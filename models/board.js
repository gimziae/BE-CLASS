// @ts-check
// 게시판 관리 스키마
const mongoose = require('mongoose');

const { Schema } = mongoose;

// 제약사항 설정
const boardSchema = new Schema(
  {
    id: {
      type: String,
      required: true,
      unique: true,
    },
    password: {
      type: String,
      required: true,
    },
    createdAt: {
      type: Date,
      default: Date.now,
    },
  },
  {
    collection: 'mongoose-board',
  },
);

module.exports = mongoose.model('Board', boardSchema);
