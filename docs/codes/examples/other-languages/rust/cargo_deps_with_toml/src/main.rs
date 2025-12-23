extern crate base64;
extern crate flate2;

use base64::{encode, decode};
use flate2::Compression;
use flate2::write::ZlibEncoder;
use std::io::prelude::*;

fn main() {
    let a = b"hello world";
    println!("base64: {}", encode(a));
    let mut e = ZlibEncoder::new(Vec::new(), Compression::default());
    e.write_all(a).unwrap();
    println!("zlib: {:?}", e.finish().unwrap());
}
