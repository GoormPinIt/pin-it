import React, { useState, ChangeEvent, useEffect, useRef } from 'react';
import Form from '../components/Form';
import Sidebar from '../components/Sidebar';
import InputField from '../components/InputField';
import { HiArrowUpCircle } from 'react-icons/hi2';

import './PinBuilder.css';

const PinBuilder = () => {
    const [imgBase64, setImgBase64] = useState<string>(''); // 파일 base64
    const [imgFile, setImgFile] = useState<File | null>(null); // 파일
    const [uploadedfile, setUploadedfile] = useState<string>(''); // 업로드한 파일
    const [title, setTitle] = useState<string>('');
    const [imgDes, setImgDes] = useState<string>(''); // 업로드한 파일 설명
    const name = localStorage.getItem('user_name');

    const [isSidebarExpanded, setIsSidebarExpanded] = useState(false);
    const fileInputRef = useRef<HTMLInputElement>(null);

    const handleChangeFile = (event: ChangeEvent<HTMLInputElement>) => {
        console.log('File change event triggered'); // 이벤트 발생 확인

        if (event.target.files && event.target.files[0]) {
            const file = event.target.files[0];
            console.log('File selected:', file.name); // 선택된 파일 정보 로깅

            const reader = new FileReader();
            reader.onload = (e) => {
                if (e.target && typeof e.target.result === 'string') {
                    console.log('File read successfully'); // 파일 읽기 성공 로그
                    setImgBase64(e.target.result);
                }
            };
            reader.onerror = (e) => {
                console.error('Error reading file:', e); // 파일 읽기 오류 로그
            };
            reader.readAsDataURL(file);
            setImgFile(file);
        } else {
            console.log('No file selected'); // 파일 선택되지 않음 로그
        }
    };

    // useEffect(() => {
    //     const fileInput = fileInputRef.current;
    //     if (fileInput) {
    //         fileInput.addEventListener('change', handleChangeFile);
    //         return () => fileInput.removeEventListener('change', handleChangeFile);
    //     }
    // }, []);

    return (
        <div className="pin-builder-container">
            <div className="pin-builder-header">Header</div>

            <div className="pin-builder-main">
                <Sidebar />
                <div className="pin-builder-bar">
                    <div className="pin-builder-bar-space"></div>
                    <h1 className="pin-builder-title">핀 만들기</h1>
                </div>

                <div className="pin-builder-content">
                    <div className="pin-builder-inner-container">
                        {/* 첫 번째 영역 */}
                        <div className="pin-builder-first-area">
                            <div className="pin-builder-first-area-content">
                                <div className="bg-white rounded-2xl">
                                    <div className="h-[450px] w-[375px] bg-[#e9e9e9] rounded-[5%] border-[2px] border-gray-300 border-dashed relative overflow-hidden">
                                        {!imgBase64 ? (
                                            <label className="absolute inset-0 flex flex-col justify-center items-center cursor-pointer text-gray-600 gap-4">
                                                <HiArrowUpCircle className="text-[40px] text-black" />
                                                <h2 className="font-normal text-black max-w-[220px] text-center">
                                                    파일을 선택하거나 여기로 끌어다 놓으세요.
                                                </h2>
                                                <input
                                                    ref={fileInputRef}
                                                    id="dropzone-file"
                                                    type="file"
                                                    className="hidden"
                                                    accept="image/*"
                                                    onChange={handleChangeFile}
                                                />
                                                <div className="absolute bottom-4 px-6 text-center text-gray-500 text-[12px] leading-snug">
                                                    Pinterest는 20 MB 미만의 고화질 .jpg 파일 또는 200 MB 미만의 .mp4
                                                    파일 사용을 권장합니다.
                                                </div>
                                            </label>
                                        ) : (
                                            <img
                                                src={imgBase64}
                                                alt="미리 보기"
                                                className="absolute inset-0 w-full h-full object-cover"
                                            />
                                        )}
                                    </div>
                                </div>
                                <hr className="pin-builder-divider" />
                                <button className="pin-builder-save-button">URL에서 저장</button>
                            </div>
                        </div>

                        {/* 두 번째 영역 */}
                        <div className="pin-builder-second-area">
                            <div className="pin-builder-second-area-content">
                                <form className="pin-builder-form">
                                    <InputField label="제목" placeholder="제목 추가" />
                                    <InputField label="설명" placeholder="자세한 설명을 추가하세요." textarea />
                                    <InputField label="링크" placeholder="링크 추가" type="url" />
                                    <InputField label="보드" placeholder="보드 선택" />
                                    <InputField label="태그된 주제 (0)개" placeholder="태그 검색" />
                                    <p className="pin-builder-note">
                                        걱정하지 마세요. 사람들에게 태그는 보여지지 않습니다.
                                    </p>
                                    <div className="pin-builder-options">
                                        <div className="pin-builder-options-label">추가 옵션</div>
                                        <div className="pin-builder-options-icon">
                                            <svg
                                                aria-label="보드 닫기"
                                                height="12"
                                                role="img"
                                                viewBox="0 0 24 24"
                                                width="12"
                                            >
                                                <path d="M20.16 6.65 12 14.71 3.84 6.65a2.27 2.27 0 0 0-3.18 0 2.2 2.2 0 0 0 0 3.15L12 21 23.34 9.8a2.2 2.2 0 0 0 0-3.15 2.26 2.26 0 0 0-3.18 0"></path>
                                            </svg>
                                        </div>
                                    </div>
                                    <p className="pin-builder-warning">
                                        불법 촬영 콘텐츠 등을 게시하는 경우 Pinterest는 한국 전기통신사업법
                                        제22-5(1)조에 따라 해당 콘텐츠의 액세스를 삭제하거나 차단할 수 있으며, 사용자는
                                        관련 법률 및 규정에 따라 처벌을 받을 수 있습니다.
                                    </p>
                                </form>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default PinBuilder;
