import React, { useState } from 'react';
import { BmiData } from '../types';
import LoadingSpinner from './LoadingSpinner';
import { UserIcon, PhoneIcon, CalendarIcon, SendIcon } from './icons/FormIcons';
import supabase from '../supabaseClient';

interface RegistrationFormProps {
    onSuccess: (data: BmiData) => void;
}

// Función local para calcular la categoría del IMC, reemplazando la llamada a la API.
const getBmiCategory = (imc: number): string => {
    if (imc < 18.5) return 'Bajo peso';
    if (imc >= 18.5 && imc < 25) return 'Peso normal';
    if (imc >= 25 && imc < 30) return 'Sobrepeso';
    if (imc >= 30 && imc < 35) return 'Obesidad clase I';
    if (imc >= 35 && imc < 40) return 'Obesidad clase II';
    if (imc >= 40) return 'Obesidad clase III';
    return 'Categoría no determinada';
};


const RegistrationForm: React.FC<RegistrationFormProps> = ({ onSuccess }) => {
    const [formData, setFormData] = useState({
        nombre: '',
        telefono: '',
        edad: '',
        peso: '',
        altura: '',
    });
    const [isLoading, setIsLoading] = useState(false);
    const [serverError, setServerError] = useState<string | null>(null);
    const [errors, setErrors] = useState<{ [key: string]: string }>({});

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
        if (errors[name]) {
            setErrors(prev => {
                const newErrors = { ...prev };
                delete newErrors[name];
                return newErrors;
            });
        }
    };

    const validate = (): boolean => {
        const newErrors: { [key: string]: string } = {};

        if (!formData.nombre.trim()) newErrors.nombre = 'El nombre es obligatorio.';
        
        if (!formData.telefono.trim()) {
            newErrors.telefono = 'El teléfono es obligatorio.';
        } else if (!/^\d{7,}$/.test(formData.telefono.replace(/\s/g, ''))) {
            newErrors.telefono = 'Introduce un número de teléfono válido.';
        }

        if (!formData.edad) {
            newErrors.edad = 'La edad es obligatoria.';
        } else if (isNaN(parseInt(formData.edad)) || parseInt(formData.edad) <= 0) {
            newErrors.edad = 'Introduce una edad válida y positiva.';
        }

        if (!formData.peso) {
            newErrors.peso = 'El peso es obligatorio.';
        } else if (isNaN(parseFloat(formData.peso)) || parseFloat(formData.peso) <= 0) {
            newErrors.peso = 'Introduce un peso válido y positivo.';
        }

        if (!formData.altura) {
            newErrors.altura = 'La altura es obligatoria.';
        } else if (isNaN(parseFloat(formData.altura)) || parseFloat(formData.altura) <= 0) {
            newErrors.altura = 'Introduce una altura válida y positiva.';
        }

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };


    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!validate()) {
            return;
        }

        setIsLoading(true);
        setServerError(null);

        const { nombre, telefono } = formData;
        const edad = parseInt(formData.edad);
        const peso = parseFloat(formData.peso);
        const altura = parseFloat(formData.altura);

        const alturaM = altura / 100;
        const imc = parseFloat((peso / (alturaM * alturaM)).toFixed(2));

        const categoria = getBmiCategory(imc);

        const resultData: BmiData = {
            nombre,
            telefono,
            edad,
            peso,
            altura,
            imc,
            categoria,
            estado: 'Nuevo',
        };
        
        try {
            const { error: supabaseError } = await supabase
                .from('registros_imc')
                .insert([resultData]);

            if (supabaseError) {
                console.error('Supabase error:', supabaseError);
                throw new Error('No se pudo guardar el registro en la base de datos.');
            }

            onSuccess(resultData);
            setFormData({
                nombre: '',
                telefono: '',
                edad: '',
                peso: '',
                altura: '',
            });

        } catch (err) {
            console.error(err);
            setServerError('Hubo un error al guardar tu registro. Por favor, inténtalo de nuevo.');
        } finally {
            setIsLoading(false);
        }
    };
    
    return (
        <div className="bg-white p-8 rounded-lg shadow-lg w-full max-w-md">
            <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                    <div className="relative">
                        <span className="absolute inset-y-0 left-0 flex items-center pl-3">
                            <UserIcon />
                        </span>
                        <input
                            type="text"
                            name="nombre"
                            value={formData.nombre}
                            onChange={handleChange}
                            placeholder="Nombre completo"
                            className={`w-full pl-10 pr-4 py-2 border rounded-lg focus:outline-none focus:ring-2 ${errors.nombre ? 'border-red-500 focus:ring-red-500' : 'focus:ring-green-500'}`}
                        />
                    </div>
                    {errors.nombre && <p className="text-red-500 text-xs mt-1 ml-1">{errors.nombre}</p>}
                </div>
                <div>
                    <div className="relative">
                        <span className="absolute inset-y-0 left-0 flex items-center pl-3">
                            <PhoneIcon />
                        </span>
                        <input
                            type="tel"
                            name="telefono"
                            value={formData.telefono}
                            onChange={handleChange}
                            placeholder="Teléfono"
                            className={`w-full pl-10 pr-4 py-2 border rounded-lg focus:outline-none focus:ring-2 ${errors.telefono ? 'border-red-500 focus:ring-red-500' : 'focus:ring-green-500'}`}
                        />
                    </div>
                    {errors.telefono && <p className="text-red-500 text-xs mt-1 ml-1">{errors.telefono}</p>}
                </div>
                <div>
                    <div className="relative">
                        <span className="absolute inset-y-0 left-0 flex items-center pl-3">
                            <CalendarIcon />
                        </span>
                        <input
                            type="number"
                            name="edad"
                            value={formData.edad}
                            onChange={handleChange}
                            placeholder="Edad"
                            min="1"
                            inputMode="numeric"
                            className={`w-full pl-10 pr-4 py-2 border rounded-lg focus:outline-none focus:ring-2 ${errors.edad ? 'border-red-500 focus:ring-red-500' : 'focus:ring-green-500'}`}
                        />
                    </div>
                    {errors.edad && <p className="text-red-500 text-xs mt-1 ml-1">{errors.edad}</p>}
                </div>
                <div className="grid grid-cols-2 gap-4">
                    <div>
                        <div className="relative">
                            <input
                                type="number"
                                name="peso"
                                value={formData.peso}
                                onChange={handleChange}
                                placeholder="Peso (kg)"
                                step="0.1"
                                min="1"
                                inputMode="decimal"
                                className={`w-full pl-4 pr-4 py-2 border rounded-lg focus:outline-none focus:ring-2 ${errors.peso ? 'border-red-500 focus:ring-red-500' : 'focus:ring-green-500'}`}
                            />
                        </div>
                        {errors.peso && <p className="text-red-500 text-xs mt-1 ml-1">{errors.peso}</p>}
                    </div>
                    <div>
                         <div className="relative">
                             <input
                                type="number"
                                name="altura"
                                value={formData.altura}
                                onChange={handleChange}
                                placeholder="Altura (cm)"
                                min="1"
                                inputMode="decimal"
                                className={`w-full pl-4 pr-4 py-2 border rounded-lg focus:outline-none focus:ring-2 ${errors.altura ? 'border-red-500 focus:ring-red-500' : 'focus:ring-green-500'}`}
                            />
                        </div>
                        {errors.altura && <p className="text-red-500 text-xs mt-1 ml-1">{errors.altura}</p>}
                    </div>
                </div>

                {serverError && <p className="text-red-500 text-sm text-center">{serverError}</p>}

                <button
                    type="submit"
                    disabled={isLoading}
                    className="w-full bg-green-600 text-white py-3 rounded-lg font-semibold hover:bg-green-700 transition-colors duration-300 flex items-center justify-center disabled:bg-gray-400 mt-4"
                >
                    {isLoading ? <LoadingSpinner /> : (
                        <>
                            <span className="mr-2">¡Empezar mi transformación!</span>
                            <SendIcon />
                        </>
                    )}
                </button>
            </form>
        </div>
    );
};

export default RegistrationForm;