import { Box, Button } from '@chakra-ui/react'
import ReactModal from 'react-modal';
import React from 'react'
import { AiOutlineClose } from 'react-icons/ai';
import TextInput from '../common/TextInput';
import TextArea from '../common/TextArea';
import { useFormik } from 'formik';
import { collection, Timestamp, addDoc } from '@firebase/firestore';
import { auth, db } from '../../config/firebase';
import { toast } from 'react-toastify';

ReactModal.setAppElement('#react-modal-portal');

const CreateNoteModal = ({ modalIsOpen, toggleModal }) => {
    const user = auth.currentUser;
    const handleAddFunctionality = async (notesObj) => {
        try {
            await addDoc(collection(db, 'notes'), {
                ...notesObj,
                userID: user.uid,
                createdAt: Timestamp.now(),
            });

            toggleModal();
            toast.success('Note Created Sucessfully');
            formik.resetForm();
        } catch (error) {
            toast.error(error.message);
        }
    }

    const formik = useFormik({
        initialValues: {
            title: '',
            description: '',
        },
        onSubmit: (value) => {
            handleAddFunctionality(value);
        }
    });

    return (
        <Box className='relative'>
            <ReactModal
                isOpen={modalIsOpen}
                onRequestClose={toggleModal}
                className='absolute top-[25%] left-[5%] md:left-[30%] w-[90%] md:w-[40%] bg-slate-300 rounded-lg px-5 py-5'
            >
                <Box className='w-fit ml-auto'>
                    <Button
                        onClick={toggleModal}
                        _hover={false}
                        bgColor='red.500'
                        color={'white'}
                    >
                        <AiOutlineClose />
                    </Button>
                </Box>
                <form onSubmit={formik.handleSubmit}>
                    <TextInput
                        placeholder={'Enter Title'}
                        name='title'
                        type={'text'}
                        value={formik.values.title}
                        onChange={formik.handleChange}
                    />
                    <TextArea
                        placeholder={'Enter Description'}
                        name='description'
                        value={formik.values.description}
                        onChange={formik.handleChange}
                    />
                    <Button
                        className='w-full'
                        _hover={false}
                        bgColor={'#3944f7'}
                        color={'#ffffff'}
                        type={'submit'}
                    >
                        Add Note
                    </Button>
                </form>
            </ReactModal>
        </Box>
    )
}

export default CreateNoteModal