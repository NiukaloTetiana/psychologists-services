import { useState } from "react";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import { toast } from "react-toastify";

import { Icon } from "../../components";

import { logInUser, registrationUser } from "../../services";
import {
  registrationSchema,
  logInSchema,
} from "../../schemas/validationSchemas";

export const AuthForm = ({
  registration,
  onClick,
  handleRegistrationSuccess,
}) => {
  const [showPass, setShowPass] = useState(false);
  const {
    register,
    reset,
    handleSubmit,
    formState: { errors, dirtyFields },
  } = useForm({
    mode: "onChange",
    resolver: yupResolver(registration ? registrationSchema : logInSchema),
  });

  const handleSpanClick = (value) => {
    onClick(value);
    reset();
  };

  const inputClass = (fieldName) => {
    const baseClass =
      "w-full bg-transparent border border-borderColor rounded-[12px] px-[18px] py-[14px] lg:py-[16px] font-normal text-[14px] lg:text-[16px] leading-[1.25] text-darkColor placeholder:text-darkColor hover:shadow-custom-shadow focus:shadow-custom-shadow transition duration-300";
    const errorClass = "border-red-700";
    const successClass =
      "border-green-700 hover:shadow-success-shadow focus:shadow-success-shadow";

    if (errors[fieldName]?.message && dirtyFields[fieldName]) {
      return `${baseClass} ${errorClass}`;
    }
    if (!errors[fieldName]?.message && dirtyFields[fieldName]) {
      return `${baseClass} ${successClass}`;
    }
    return baseClass;
  };

  const renderMessage = (fieldName) => {
    if (errors[fieldName]?.message && dirtyFields[fieldName]) {
      return (
        <p className="text-red-700 text-[10px] lg:text-[14px] font-normal absolute bottom-[-7px] left-[8px] px-[4px] bg-lightColor">
          {errors[fieldName]?.message}
        </p>
      );
    }
    return (
      <p className="text-green-700 text-[10px] lg:text-[14px] font-normal absolute bottom-[-7px] left-[8px] px-[4px] bg-lightColor">
        {!errors[fieldName]?.message && dirtyFields[fieldName]
          ? `${fieldName.charAt(0).toUpperCase()}${fieldName.slice(
              1
            )} is entered correct`
          : ""}
      </p>
    );
  };

  const onSubmit = async (data) => {
    const { name, email, password } = data;

    try {
      if (registration) {
        await registrationUser(name, email, password);
        handleRegistrationSuccess(name);
        toast.success(`Yohoo! ${name}, you are successfully registered!`);
      } else {
        await logInUser(email, password);

        toast.success(`Welcome back, ${email}!`);
      }
    } catch (error) {
      toast.error(error.message);
    }
  };

  return (
    <>
      <h2 className="font-medium text-[30px] leading-[1.2] tracking-[-0.02em] text-darkColor mb-[20px] sm-max:text-[25px] sm-max:mb-[15px] lg:text-[40px]">
        {registration ? "Registration" : "Log In"}
      </h2>
      <p className="font-normal text-[14px] leading-[1.25] text-textColor mb-[20px] w-[267px] sm-max:w-[230px] md:w-[300px] lg:w-[438px] sm-max:text-[12px] sm-max:mb-[15px] lg:text-[16px] lg:mb-[40px]">
        {registration
          ? "Thank you for your interest in our platform! In order to register, we need some information. Please provide us with the following information."
          : "Welcome back! Please enter your credentials to access your account and continue your babysitter search."}
      </p>

      <form
        onSubmit={handleSubmit(onSubmit)}
        className="flex flex-col pb-[10px]"
      >
        {registration && (
          <div className="relative mb-[12px] lg:mb-[18px]">
            <input
              name="name"
              type="text"
              placeholder="Name"
              className={inputClass("name")}
              {...register("name")}
            />
            {!errors.name?.message && dirtyFields.name && (
              <Icon
                id="success"
                size="16"
                className="fill-green-700 absolute top-1/2 right-4 transform -translate-y-1/2 lg:size-[20px]"
              />
            )}
            {errors.name?.message && dirtyFields.name && (
              <Icon
                id="error"
                size="16"
                className="fill-red-700 absolute top-1/2 right-4 transform -translate-y-1/2 lg:size-[20px]"
              />
            )}
            {renderMessage("name")}
          </div>
        )}

        <div className="relative mb-[12px] lg:mb-[18px]">
          <input
            name="email"
            type="text"
            placeholder="Email"
            className={inputClass("email")}
            {...register("email")}
          />
          {!errors.email?.message && dirtyFields.email && (
            <Icon
              id="success"
              size="16"
              className="fill-green-700 absolute top-1/2 right-4 transform -translate-y-1/2 lg:size-[20px]"
            />
          )}
          {errors.email?.message && dirtyFields.email && (
            <Icon
              id="error"
              size="16"
              className="fill-red-700 absolute top-1/2 right-4 transform -translate-y-1/2 lg:size-[20px]"
            />
          )}
          {renderMessage("email")}
        </div>
        <div>
          <div className="relative mb-[20px] sm-max:mb-[15px] lg:mb-[40px]">
            <input
              name="password"
              type={showPass ? "text" : "password"}
              placeholder="Password"
              className={inputClass("password")}
              {...register("password")}
            />
            <button type="button" onClick={() => setShowPass((prev) => !prev)}>
              {showPass ? (
                <Icon
                  id="eye"
                  className="absolute top-1/2 right-4 transform -translate-y-1/2 stroke-darkColor fill-none lg:size-[20px]"
                  size="16"
                />
              ) : (
                <Icon
                  id="eye-off"
                  className="absolute top-1/2 right-4 transform -translate-y-1/2 stroke-darkColor fill-none lg:size-[20px]"
                  size="16"
                />
              )}
            </button>
            {renderMessage("password")}
          </div>
        </div>

        <button
          type="submit"
          className="border-none rounded-[30px] px-[18px] py-[14px] lg:py-[16px] w-full bg-accentColor font-medium text-[14px] lg:text-[16px] leading-[1.25] tracking-[-0.01em] text-lightColor hover:bg-hoverColor focus:bg-hoverColor hover:text-darkColor focus:text-darkColor transition duration-300"
        >
          {registration ? "Sign Up" : "Log In"}
        </button>
      </form>

      <p className="w-full font-normal text-[14px] text-center leading-[1.25] text-textColor sm-max:text-[12px] lg:text-[16px]">
        {registration ? "Already have an account?" : "Don't have an account?"}{" "}
        <span
          onClick={() => {
            registration ? handleSpanClick(false) : handleSpanClick(true);
          }}
          className="text-darkColor underline cursor-pointer"
        >
          {registration ? "Log In" : "Registration"}
        </span>
      </p>
    </>
  );
};
