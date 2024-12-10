//1. DEFINICION DE CLASES
//1.1. CLASE DIRECCION
/*La clase Dirección representa una dirección física con atributos como calle, número, piso, código postal, 
provincia y localidad.
Incluye validaciones en el constructor y métodos para acceder y mostrar la información.*/
class Direccion {
    // Declaración de propiedades privadas (solo accesibles dentro de la clase)
    #calle; 
    #numero;
    #piso;
    #codigoPostal;
    #provincia;
    #localidad;

    /*Constructor para inicializar los atributos de la clase Dirección.
    Realiza una validación en el código postal y establece valores por defecto cuando sea necesario.*/
    constructor(calle, numero, piso, codigoPostal, provincia, localidad) {
        // Asignación de valores a las propiedades privadas
        this.#calle = calle;
        this.#numero = numero;
        this.#piso = piso || "S/N"; // Si no se proporciona piso, usa "S/N" por defecto.
        this.#codigoPostal = /^[0-9]{5}$/.test(codigoPostal) ? codigoPostal : "00000"; // Valida que el código postal sea 5 dígitos.
        this.#provincia = provincia;
        this.#localidad = localidad;
    }

    // Métodos getter: permiten acceder a las propiedades privadas desde fuera de la clase.
    get calle() {
        return this.#calle;
    }

    get numero() {
        return this.#numero;
    }

    get piso() {
        return this.#piso;
    }

    get codigoPostal() {
        return this.#codigoPostal;
    }

    get provincia() {
        return this.#provincia;
    }

    get localidad() {
        return this.#localidad;
    }

    //Devuelve una representación en texto de la dirección.
    toString() {
        return `C/ ${this.#calle}, nº ${this.#numero}, Piso: ${this.#piso}, ${this.#localidad}, ${this.#provincia}, ${this.#codigoPostal}`;
    }
}


//1.2. CLASE ESTUDIANTE
/*Representa un estudiante con atributos como nombre, edad, dirección y asignaturas matriculadas.
Proporciona métodos para gestionar las asignaturas, calificaciones y obtener promedios.*/
class Estudiante {
    // Atributos privados
    #id; // Identificador único del estudiante
    #nombre; // Nombre del estudiante
    #edad; // Edad del estudiante
    #direccion; // Dirección del estudiante (objeto de la clase Direccion)
    #asignaturas; // Asignaturas matriculadas (objeto con claves como nombres de asignaturas y valores con calificaciones y fecha)
    static contadorId = 1; // Contador estático para asignar IDs únicos

    /*Constructor para inicializar un estudiante con nombre, edad y dirección.
    Realiza validaciones en los valores ingresados.*/
    constructor(nombre, edad, direccion) {
        if (!/^[a-zA-ZáéíóúüÁÉÍÓÚÜ\s]+$/.test(nombre)) {
            throw new Error("El nombre solo debe contener letras y espacios."); // Valida que el nombre contenga solo letras y espacios
        }

        this.#id = Estudiante.contadorId++; // Asigna un ID único usando el contador estático
        this.#nombre = nombre; // Asigna el nombre
        this.#edad = (!Number.isNaN(edad) && edad > 0) ? edad : 0; // Valida y asigna la edad (debe ser un número positivo)
        this.#direccion = direccion; // Asigna la dirección
        this.#asignaturas = {}; // Inicializa el objeto de asignaturas como vacío, Clave: Nombre de la asignatura, Valor: { calificaciones: [], fecha: Date }
    }

    // Getters: permiten acceder a los atributos privados de forma controlada   
    get id() {
        return this.#id;
    }

    get nombre() {
        return this.#nombre;
    }

    get edad() {
        return this.#edad;
    }

    get direccion() {
        return this.#direccion;
    }

    get asignaturas() {
        return this.#asignaturas;
    }

    /*Método para matricular al estudiante en una asignatura.
    Si el estudiante ya está matriculado, lanza un error.*/
    matricular(asignatura) {
        if (!this.#asignaturas[asignatura.nombre]) {
            // Si no está matriculado, agrega la asignatura con calificaciones vacías y fecha actual
            this.#asignaturas[asignatura.nombre] = { 
                calificaciones: [], 
                fecha: new Date().toLocaleDateString("es-ES", { year: "numeric", month: "long", day: "numeric" })  
            };
            console.log(`Estudiante matriculado en ${asignatura.nombre}.`);
        } else {
            throw new Error(`El estudiante ya está matriculado en ${asignatura.nombre}`); // Lanza un error si ya está matriculado
        }
    }

    /*Método para desmatricular al estudiante de una asignatura.
    Si no está matriculado en la asignatura, muestra un mensaje.*/
    desmatricular(asignatura) {
        if (this.#asignaturas[asignatura.nombre]) {
            // Si está matriculado, elimina la asignatura
            delete this.#asignaturas[asignatura.nombre];
            console.log(`Asignatura ${asignatura.nombre} eliminada del estudiante ${this.nombre}.`);
        } else {
            console.log(`El estudiante ${this.nombre} no está matriculado en ${asignatura.nombre}.`); // Muestra mensaje si no está matriculado
        }
    }
    
    /*Método para agregar una calificación a una asignatura.
    Valida que la asignatura exista y que la calificación sea un entero entre 0 y 10.*/
    agregarCalificacion(asignatura, calificacion) {
        if (!this.#asignaturas[asignatura.nombre]) {
            throw new Error("El estudiante no está matriculado en esta asignatura."); // Lanza error si no está matriculado
        }

        if (calificacion < 0 || calificacion > 10 || !Number.isInteger(calificacion)) {
            throw new Error("La calificación debe ser un entero entre 0 y 10."); // Valida que la calificación sea válida
        }

        this.#asignaturas[asignatura.nombre].calificaciones.push(calificacion); // Agrega la calificación
    }

    /*Calcula el promedio general de todas las asignaturas del estudiante.
    Si no tiene asignaturas o calificaciones, devuelve 0.*/
    obtenerPromedioGeneral() {
        /*Object.values(this.#asignaturas): Convierte los valores del objeto privado this.#asignaturas en un array.
        .map(): Devuelve un nuevo array, transformando cada asignatura en su promedio de calificaciones.
        (asignatura => { ... }): Recibe cada elemento del array y realiza cálculos para devolver el promedio de las calificaciones de esa asignatura.*/
        const promedios = Object.values(this.#asignaturas).map(asignatura => {
            if (asignatura.calificaciones.length === 0) return 0; // Si no hay calificaciones, el promedio es 0
            /*.reduce(): Función de acumulación sobre cada elemento del array, devolviendo un único valor como resultado.
            sum: Es el acumulador, que contiene el valor acumulado a medida que se procesan los elementos del array.
            cal: Es el valor del elemento actual que se está procesando.
            0: Es el valor inicial del acumulador sum. Aquí comienza con 0.*/
            const suma = asignatura.calificaciones.reduce((sum, cal) => sum + cal, 0); // Suma todas las calificaciones
            return suma / asignatura.calificaciones.length; // Calcula el promedio de la asignatura
        });
    
        if (promedios.length === 0) return 0; // Si no hay asignaturas, el promedio es 0
    
        const promedioGeneral = promedios.reduce((sum, prom) => sum + prom, 0) / promedios.length; // Calcula el promedio general
        return parseFloat(promedioGeneral.toFixed(2)); // Redondea el promedio a 2 decimales
    }

    /*Devuelve una representación en texto del estudiante.
    Incluye ID, nombre, edad y dirección.*/
    toString() {
        return `ID: ${this.#id}, Nombre: ${this.#nombre}, Edad: ${this.#edad}, Dirección: ${this.#direccion.toString()}`;
    }
}


//1.3. CLASE ASIGNATURA
/*Representa una asignatura con un nombre y un conjunto de calificaciones asociadas.
Proporciona métodos para gestionar calificaciones y calcular el promedio.*/
class Asignatura {
    // Atributos privados
    #nombre; // Nombre de la asignatura
    #calificaciones; // Array para almacenar las calificaciones de la asignatura

    /*Constructor para inicializar una asignatura con su nombre.
    Valida el nombre para asegurar que solo contiene caracteres permitidos.*/
    constructor(nombre) {
        if (!/^[a-zA-ZáéíóúüÁÉÍÓÚÜ\s]+$/.test(nombre)) {
            throw new Error("El nombre de la asignatura solo debe contener letras, números romanos y espacios."); // Valida el nombre
        }

        this.#nombre = nombre; // Asigna el nombre de la asignatura
        this.#calificaciones = []; // Inicializa el array de calificaciones como vacío
    }

    // Getters: permiten acceder a los atributos privados de forma controlada
    get nombre() {
        return this.#nombre;
    }

    get calificaciones() {
        return this.#calificaciones;
    }

    /*Método para agregar una calificación a la asignatura.
    Valida que la calificación sea un número entero entre 0 y 10.*/
    agregarCalificacion(calificacion) {
        if (calificacion < 0 || calificacion > 10 || !Number.isInteger(calificacion)) {
            throw new Error("La calificación debe ser un entero entre 0 y 10."); // Valida la calificación
        }

        this.#calificaciones.push(calificacion); // Agrega la calificación al array
    }

    /*Calcula el promedio de las calificaciones en la asignatura.
    Si no hay calificaciones, devuelve 0.*/
    obtenerPromedio() {
        if (this.#calificaciones.length === 0) return 0; // Si no hay calificaciones, el promedio es 0
        /*.reduce(): Función de acumulación sobre cada elemento del array, devolviendo un único valor como resultado.
        acc: Es el acumulador, que contiene el valor acumulado a medida que se procesan los elementos del array.
        cal: Es el valor del elemento actual que se está procesando.
        0: Es el valor inicial del acumulador acc. Aquí comienza con 0.*/
        const suma = this.#calificaciones.reduce((acc, cal) => acc + cal, 0); // Suma todas las calificaciones
        
        return suma / this.#calificaciones.length; // Calcula el promedio
    }

    /*Devuelve una representación en texto de la asignatura.
    Incluye solo el nombre de la asignatura.*/
    toString() {
        return `Asignatura: ${this.#nombre}`;
    }
}


//1.4. CLASE LISTA
class Lista {
    // Atributo privado para almacenar la lista interna
    #listaRef;

    // Constructor: inicializa el atributo privado como un array vacío
    constructor(){
        this.#listaRef = []; // La lista comienza vacía
    }

    // Getter para obtener una copia de la lista interna
    get lista(){
        return [...this.#listaRef]; // Retorna una copia superficial del array interno
        // Usar una copia evita que se modifique directamente el array privado desde fuera de la clase
    }

    // Getter para obtener la referencia directa al array interno
    get listaRef(){
        return this.#listaRef; // Permite acceder directamente al atributo privado
        // Esto puede ser útil para manipular la lista, pero conlleva el riesgo de modificar el estado interno
    }

    // Setter para asignar un nuevo array al atributo privado
    set listaRef(listaRef){
        this.#listaRef = listaRef; // Reemplaza el contenido interno de la lista
        // Este setter permite reinicializar la lista si es necesario
    }
}


//1.5. CLASE LISTA ESTUDIANTES
class ListaEstudiantes extends Lista {
    // Atributo privado para almacenar la lista de estudiantes
    #estudiantes;

    // Constructor: inicializa la lista de estudiantes como un array vacío
    constructor() {
        super(); // Llama al constructor de la clase padre `Lista`
        this.#estudiantes = []; // Lista específica para estudiantes
    }

    // Método para agregar un estudiante a la lista
    agregarEstudiante(estudiante) {
        // Verifica si ya existe un estudiante con el mismo nombre en la lista
        if (this.#estudiantes.some(e => e.nombre === estudiante.nombre)) {
            throw new Error("No se permiten duplicados en la lista de estudiantes.");
        }

        // Si no hay duplicados, agrega el estudiante al array
        this.#estudiantes.push(estudiante);
    }

    obtenerEstudiantePorId(id) {
        const estudiante = this.#estudiantes.find(e => e.id === id);
        if (!estudiante) {
            throw new Error("Estudiante no encontrado.");
        }
        return estudiante;
    }

    // Método público para obtener toda la lista de estudiantes (por depuración o búsqueda)
    get lista() {
        return this.#estudiantes;
    }

    // Método para eliminar un estudiante de la lista usando su ID
    eliminarEstudiante(id) {
        // Filtra la lista para excluir al estudiante con el ID dado
        this.#estudiantes = this.#estudiantes.filter(e => e.id !== id);
    }

    // Método para buscar estudiantes cuyo nombre contenga un patrón dado
    buscarEstudiante(patron) {
        // Retorna una lista de estudiantes cuyos nombres incluyen el patrón
        return this.#estudiantes.filter(e => e.nombre.toLowerCase().includes(patron.toLowerCase()));
    }

    // Método para calcular el promedio general de todos los estudiantes
    obtenerPromedioGeneral() {
        /*.map(): Se aplica sobre un array y devuelve un nuevo array con los resultados de ejecutar una función 
        sobre cada uno de los elementos del array original.
        e: Es el parámetro de la función de flecha que representa a cada estudiante en el array this.#estudiantes.*/
        // Obtiene el promedio de cada estudiante
        const promedios = this.#estudiantes.map(e => e.obtenerPromedioGeneral());

        // Calcula el promedio general sumando todos los promedios y dividiendo por el total de estudiantes
        return promedios.reduce((sum, prom) => sum + prom, 0) / (promedios.length || 1);
        // Si no hay estudiantes (longitud 0), evita la división por 0 usando `|| 1`
    }

    // Método para generar un reporte con la información de cada estudiante y sus asignaturas
    generarReporte() {
        // Itera por cada estudiante en la lista
        this.#estudiantes.forEach(estudiante => {
            console.log(estudiante.toString()); // Muestra los datos del estudiante como cadena
            
            // Calcular el promedio general del estudiante
            const promedioGeneral = estudiante.obtenerPromedioGeneral();
            console.log(`Promedio general: ${promedioGeneral}`);

            //Object.entries(): Se obtiene un array de arrays donde cada subarray contiene una clave (nombre de la asignatura) y su correspondiente valor (el objeto con calificaciones y fecha).
            // Itera por las asignaturas del estudiante
            Object.entries(estudiante.asignaturas).forEach(([nombre, datos]) => {
                // Calcular el promedio de la asignatura
                const promedioAsignatura = datos.calificaciones.length > 0 ? 
                datos.calificaciones.reduce((sum, cal) => sum + cal, 0) / datos.calificaciones.length : 0;
                
                // Muestra el nombre de la asignatura, sus calificaciones y el promedio
                console.log(`- ${nombre}: Calificaciones: ${datos.calificaciones.join(", ")} | Promedio: ${promedioAsignatura.toFixed(2)}`);
            });
        });
    }
}


//1.6. CLASE LISTA ASIGNATURAS
class ListaAsignaturas extends Lista {
    // Constructor que recibe un número variable de asignaturas
    constructor(...asignaturas) {
        // Llama al constructor de la clase padre (Lista)
        super();

        // Itera sobre cada asignatura pasada como argumento y la añade a la lista
        for(const asignatura of asignaturas){

            this.añadirAsignatura(asignatura);

        }
    }

    // Método para añadir una nueva asignatura a la lista
    añadirAsignatura(asignatura) {
        // Verifica si ya existe una asignatura con el mismo nombre en la lista
        if (this.listaRef.some(a => a.nombre === asignatura.nombre)) {
            // Si la asignatura ya existe, lanza un error
            throw new Error("Ya existe la asignatura.");
        }

        // Si no existe, la añade al array de asignaturas
        this.listaRef.push(asignatura);
    }

    // Método para eliminar una asignatura de la lista mediante su nombre
    eliminarAsignatura(nombre) {
        // Verifica si la asignatura con el nombre especificado existe en la lista
        if (!this.listaRef.some(a => a.nombre.toLowerCase() === nombre.toLowerCase())) {
            // Si no se encuentra, lanza un error
            throw new Error("La asignatura no se encuentra en la lista.");
        }

        // Filtra y elimina la asignatura que tiene el nombre coincidente
        this.listaRef = this.listaRef.filter(a => a.nombre.toLowerCase() !== nombre.toLowerCase());
    }

    // Método para buscar asignaturas que contengan un patrón específico en su nombre
    busquedaAsignaturas(exp) {
        // Filtra las asignaturas cuyo nombre incluye el patrón 'exp' (ignorando mayúsculas y minúsculas)
        const resultados = this.listaRef.filter(a =>
            a.nombre.toLowerCase().includes(exp.toLowerCase())
        );
    
        // Si no se encuentra ninguna asignatura que coincida, muestra un mensaje
        if (resultados.length === 0) {
            console.log("No se encontraron asignaturas.");
        } else {
            // Si se encuentran, muestra los resultados
            console.log("Asignaturas encontradas:");
            resultados.forEach(asignatura => console.log(`- Nombre: ${asignatura.nombre}`));
        }
        
        // Devuelve los resultados de la búsqueda, por si se necesitan más adelante
        return resultados;
    }
}



//PROGRAMA PRINCIPAL
// Función que muestra el menú principal y devuelve la opción elegida
function menuPrincipal() {
    // Muestra el título y las opciones del menú principal
    console.log("\n--- MENÚ PRINCIPAL ---");
    console.log("1. Gestionar estudiantes");
    console.log("2. Gestionar asignaturas");
    console.log("3. Ver reporte general");
    console.log("4. Salir");
    
    // Pide al usuario que elija una opción y la convierte en número entero
    return parseInt(prompt("Elige una opción: "));
}

// Función que muestra el menú de gestión de estudiantes y devuelve la opción elegida
function menuEstudiantes() {
    // Muestra el título y las opciones del menú para gestionar estudiantes
    console.log("\n--- MENÚ ESTUDIANTES ---");
    console.log("1. Añadir estudiante");
    console.log("2. Eliminar estudiante");
    console.log("3. Buscar estudiante");
    console.log("4. Matricular estudiante");
    console.log("5. Añadir calificación");
    console.log("6. Desmatricular asignatura");
    console.log("7. Calcular promedio del estudiante");
    console.log("8. Volver");

    // Pide al usuario que elija una opción y la convierte en número entero
    return parseInt(prompt("Elige una opción: "));
}

// Función que muestra el menú de gestión de asignaturas y devuelve la opción elegida
function menuAsignaturas() {
    // Muestra el título y las opciones del menú para gestionar asignaturas
    console.log("\n--- MENÚ ASIGNATURAS ---");
    console.log("1. Añadir asignatura");
    console.log("2. Eliminar asignatura");
    console.log("3. Buscar asignatura");
    console.log("4. Volver");

    // Pide al usuario que elija una opción y la convierte en número entero
    return parseInt(prompt("Elige una opción: "));
}


// Se crean instancias de las listas para gestionar estudiantes y asignaturas
const listaEstudiantes = new ListaEstudiantes();
const listaAsignaturas = new ListaAsignaturas();

// Función para gestionar estudiantes a través de un menú interactivo
function gestionarEstudiantes() {
    let opcion; // Variable para almacenar la opción elegida
    let salir = false; // Variable de control para salir del bucle
    do {
        opcion = menuEstudiantes(); // Muestra el menú de estudiantes y obtiene la opción
        switch (opcion) {
            case 1: { // Añadir estudiante
                console.log("\n--- Añadir Estudiante ---");
                // Se solicitan los datos del estudiante y se crea la dirección
                const nombre = prompt("Nombre: ");
                const edad = parseInt(prompt("Edad: "));
                const calle = prompt("Calle: ");
                const numero = prompt("Número: ");
                const piso = prompt("Piso (opcional): ");
                const codigoPostal = prompt("Código Postal: ");
                const provincia = prompt("Provincia: ");
                const localidad = prompt("Localidad: ");
                const direccion = new Direccion(calle, numero, piso, codigoPostal, provincia, localidad);

                // Se crea un nuevo estudiante y se añade a la lista
                const estudiante = new Estudiante(nombre, edad, direccion);
                listaEstudiantes.agregarEstudiante(estudiante);
                console.log("Estudiante añadido correctamente.");
                break;
            }

            case 2: { // Eliminar estudiante
                console.log("\n--- Eliminar Estudiante ---");
                const id = parseInt(prompt("ID del estudiante: "));
                listaEstudiantes.eliminarEstudiante(id);
                console.log("Estudiante eliminado correctamente.");
                break;
            }

            case 3: { // Buscar estudiante
                console.log("\n--- Buscar Estudiante ---");
                const patron = prompt("Nombre a buscar: ");
                const resultados = listaEstudiantes.buscarEstudiante(patron);
                
                if (resultados.length > 0) {
                    // Muestra los resultados encontrados
                    resultados.forEach(est => console.log(est.toString()));
                } else {
                    console.log("No se encontraron estudiantes.");
                }
                break;
            }

            case 4: { // Matricular estudiante en asignatura
                console.log("\n--- Matricular Estudiante ---");
                const id = parseInt(prompt("ID del estudiante: "));

                if (isNaN(id)) {
                    console.log("ID no válido.");
                    break;
                }

                const estudiante = listaEstudiantes.lista.find(e => e.id === id);
                
                if (estudiante) {
                    const nombreAsignatura = prompt("Nombre de la asignatura: ");
                    const asignatura = listaAsignaturas.lista.find(a => a.nombre.toLowerCase() === nombreAsignatura);
                    
                    if (asignatura) {
                        // Se matricula al estudiante en la asignatura
                        estudiante.matricular(asignatura);
                        console.log("Estudiante matriculado correctamente.");
                    } else {
                        console.log("Asignatura no encontrada.");
                    }

                } else {
                    console.log("Estudiante no encontrado.");
                }
                break;
            }

            case 5: { // Añadir calificación a un estudiante
                console.log("\n--- Añadir Calificación ---");
                const id = parseInt(prompt("ID del estudiante: "));
                const estudiante = listaEstudiantes.lista.find(e => e.id === id);
                
                if (estudiante) {
                    const nombreAsignatura = prompt("Nombre de la asignatura: ");
                    const calificacion = parseInt(prompt("Calificación (0-10): "));
                    const asignatura = listaAsignaturas.lista.find(a => a.nombre.toLowerCase() === nombreAsignatura);
                    
                    if (asignatura) {
                        // Se agrega la calificación del estudiante en la asignatura
                        estudiante.agregarCalificacion(asignatura, calificacion);
                        console.log("Calificación añadida correctamente.");
                    } else {
                        console.log("Asignatura no encontrada.");
                    }

                } else {
                    console.log("Estudiante no encontrado.");
                }
                break;
            }

            case 6: { // Desmatricular estudiante de asignatura
                console.log("\n--- Desmatricular Estudiante ---");
                const id = parseInt(prompt("ID del estudiante: "));
                const estudiante = listaEstudiantes.lista.find(e => e.id === id);
                
                if (estudiante) {
                    const nombreAsignatura = prompt("Nombre de la asignatura: ");
                    const asignatura = listaAsignaturas.lista.find(a => a.nombre.toLowerCase() === nombreAsignatura);
                    
                    if (asignatura) {
                        // Se desmatricula al estudiante de la asignatura
                        estudiante.desmatricular(asignatura);
                        console.log(`El estudiante ${estudiante.nombre} ha sido desmatriculado de ${asignatura.nombre}.`);
                    } else {
                        console.log("Asignatura no encontrada.");
                    }
                } else {
                    console.log("Estudiante no encontrado.");
                }
                break;
            }

            case 7: { // Obtener promedio general del estudiante
                console.log("\n--- Obtener Promedio General ---");
                const id = parseInt(prompt("ID del estudiante: "));
                const estudiante = listaEstudiantes.lista.find(e => e.id === id);
                
                if (estudiante) {
                    // Se obtiene el promedio general del estudiante
                    const promedio = estudiante.obtenerPromedioGeneral();
                    console.log(`El promedio general del estudiante es: ${promedio}`);
                } else {
                    console.log("Estudiante no encontrado.");
                }
                break;
            }
            
            case 8:// Volver al menú principal
                console.log("Volviendo al menú principal...");
                salir = true;  // Cambia el valor de la variable de control para salir
                break;
            default:
                console.log("Opción inválida.");
        }
    } while (!salir); // El bucle sigue hasta que el usuario elige salir
}

// Función para gestionar asignaturas
function gestionarAsignaturas() {
    let opcion;
    do {
        opcion = menuAsignaturas(); // Muestra el menú de asignaturas y obtiene la opción
        switch (opcion) {
            case 1: { // Añadir asignatura
                console.log("\n--- Añadir Asignatura ---");
                const nombre = prompt("Nombre de la asignatura: ");
                const asignatura = new Asignatura(nombre);
                listaAsignaturas.añadirAsignatura(asignatura); // Añade la asignatura a la lista
                console.log("Asignatura añadida correctamente.");
                break;
            }

            case 2: { // Eliminar asignatura
                console.log("\n--- Eliminar Asignatura ---");
                const nombre = prompt("Nombre de la asignatura: ");
                listaAsignaturas.eliminarAsignatura(nombre); // Elimina la asignatura de la lista
                console.log("Asignatura eliminada correctamente.");
                break;
            }

            case 3: { // Buscar asignatura
                console.log("\n--- Buscar Asignatura ---");
                const exp = prompt("Nombre o parte del nombre a buscar: ");
                listaAsignaturas.busquedaAsignaturas(exp); // Muestra las asignaturas que coinciden con la búsqueda
                break;
            }

            case 4: // Volver al menú principal
                console.log("Volviendo al menú principal...");
                break;
            default:
                console.log("Opción inválida.");
        }
    } while (opcion !== 4); // El bucle sigue hasta que el usuario elige salir
}

// Función para generar el reporte general de los estudiantes
function verReporteGeneral() {
    console.log("\n--- Reporte General ---");
    listaEstudiantes.generarReporte(); // Genera un reporte con los estudiantes y sus calificaciones
    console.log(`Promedio general de la lista: ${listaEstudiantes.obtenerPromedioGeneral().toFixed(2)}`);
}


// Función principal que controla el flujo del programa
function main() {
    let opcion;
    do {
        opcion = menuPrincipal(); // Muestra el menú principal y obtiene la opción
        switch (opcion) {
            case 1:
                gestionarEstudiantes(); // Llama a la función para gestionar estudiantes
                break;

            case 2:
                gestionarAsignaturas(); // Llama a la función para gestionar asignaturas
                break;

            case 3:
                verReporteGeneral(); // Muestra el reporte general
                break;

            case 4:
                console.log("Saliendo del programa..."); // Mensaje de salida
                break;

            default:
                console.log("Opción inválida."); // Mensaje si la opción es inválida
        }
    } while (opcion !== 4); // El bucle sigue hasta que el usuario elige salir
}

// Llama a la función principal para ejecutar el programa
main();



/*PRUEBAS
COMPROBAR CLASE ASIGNATURA
try {
    const matematicas = new Asignatura("Matemáticas I");

    // Verificar el nombre
    console.log(matematicas.nombre); // Debe mostrar: "Matemáticas I"

    // Agregar calificaciones válidas
    matematicas.agregarCalificacion(8);
    matematicas.agregarCalificacion(7);
    matematicas.agregarCalificacion(9);

    // Verificar las calificaciones
    console.log(matematicas.calificaciones); // Debe mostrar: [8, 7, 9]

    // Obtener el promedio
    console.log(matematicas.obtenerPromedio()); // Debe mostrar: 8

    // Usar el método toString
    console.log(matematicas.toString()); // Debe mostrar: "Nombre: Matemáticas I"
} catch (error) {
	console.error("Error al crear o manejar la asignatura:", error.message);
}



COMPROBAR CLASE LISTA ASIGNATURAS
const matematicas = new Asignatura("Matemáticas");
const historia = new Asignatura("Historia");
const fisica = new Asignatura("Física");

// Crear la lista de asignaturas
const lista = new ListaAsignaturas(matematicas, historia);

console.log(lista.lista.toString());  // Mostrar las asignaturas iniciales

// Agregar una asignatura
lista.añadirAsignatura(fisica);
console.log(lista.lista.toString());  // Mostrar todas las asignaturas

// Buscar asignaturas
lista.busquedaAsignaturas("Mat");  // Buscar "Mat"

try {
    // Intentar eliminar una asignatura que no está en la lista
    lista.eliminarAsignatura("Química");
} catch (error) {
    console.error(error.message);  // Debería lanzar error: "La asignatura no se encuentra en la lista."
}

// Eliminar asignatura
lista.eliminarAsignatura("Historia");
console.log(lista.lista.toString());  // Verifica que "Historia" ha sido eliminada



COMPROBAR CLASE ESTUDIANTE
const estudiante1 = new Estudiante("Juan", 20, "Calle Falsa 123");

const matematicas = new Asignatura("Matemáticas");
const historia = new Asignatura("Historia");

estudiante1.matricular(matematicas);
estudiante1.matricular(historia);

estudiante1.agregarCalificacion(matematicas, 8);
estudiante1.agregarCalificacion(historia, 10);

console.log("Promedio inicial:", estudiante1.obtenerPromedioGeneral()); // Debería ser 9

estudiante1.desmatricular(historia);

console.log("Asignaturas actuales:", estudiante1.asignaturas); // No debe contener Historia
console.log("Promedio tras eliminar Historia:", estudiante1.obtenerPromedioGeneral()); // Debería ser 8


PARTE 2
const matematicas = new Asignatura("Matemáticas");
const historia = new Asignatura("Historia");

// Crear un estudiante
const estudiante1 = new Estudiante("Juan Pérez", 20, "Calle Falsa 123");

// Mostrar información inicial del estudiante
console.log(estudiante1.toString());

// Matricular al estudiante en asignaturas
estudiante1.matricular(matematicas);
estudiante1.matricular(historia);
console.log("Asignaturas tras matrícula:", estudiante1.asignaturas);

// Agregar calificaciones
estudiante1.agregarCalificacion(matematicas, 8);
estudiante1.agregarCalificacion(matematicas, 7);
estudiante1.agregarCalificacion(historia, 9);

// Verificar calificaciones por asignatura
console.log("Asignaturas con calificaciones:", estudiante1.asignaturas);

// Obtener promedio general
const promedioGeneral = estudiante1.obtenerPromedioGeneral();
console.log("Promedio general del estudiante:", promedioGeneral);

// Desmatricular una asignatura
estudiante1.desmatricular(matematicas);
console.log("Asignaturas tras desmatricular Matemáticas:", estudiante1.asignaturas);

// Intentar desmatricular una asignatura no matriculada
try {
    estudiante1.desmatricular(matematicas);
} catch (e) {
    console.error(e.message);
}

// Intentar agregar calificación a asignatura no matriculada
try {
    estudiante1.agregarCalificacion(matematicas, 10);
} catch (e) {
    console.error(e.message);
}



COMPROBAR LISTA ESTUDIANTES
const listaEstudiantes = new ListaEstudiantes();

const estudiante1 = new Estudiante("Juan Pérez", 20, "Calle Falsa 123");
const estudiante2 = new Estudiante("María López", 22, "Calle Real 456");
const matematicas = { nombre: "Matemáticas" };
const historia = { nombre: "Historia" };

// Matricular asignaturas y añadir calificaciones
estudiante1.matricular(matematicas);
estudiante1.agregarCalificacion(matematicas, 9);

estudiante2.matricular(matematicas);
estudiante2.agregarCalificacion(matematicas, 7);
estudiante2.matricular(historia);
estudiante2.agregarCalificacion(historia, 8);

// Añadir estudiantes a la lista
listaEstudiantes.agregarEstudiante(estudiante1);
listaEstudiantes.agregarEstudiante(estudiante2);

// Probar métodos
console.log("Promedio general de la lista:", listaEstudiantes.obtenerPromedioGeneral()); // Promedio esperado: 8

console.log("\nBuscar estudiante con patrón 'Mar':");
listaEstudiantes.buscarEstudiante("Mar").forEach(e => console.log(e.toString()));

console.log("\nReporte de estudiantes:");
listaEstudiantes.generarReporte();

console.log("\nDespués de eliminar a Juan Pérez:");
listaEstudiantes.eliminarEstudiante(1);
listaEstudiantes.generarReporte();
*/

