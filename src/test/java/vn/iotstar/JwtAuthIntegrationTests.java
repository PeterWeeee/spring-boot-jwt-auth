package vn.iotstar;

import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.MethodOrderer;
import org.junit.jupiter.api.Order;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.TestMethodOrder;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.http.MediaType;
import org.springframework.test.web.servlet.MockMvc;
import org.springframework.test.web.servlet.MvcResult;
import org.springframework.test.web.servlet.setup.MockMvcBuilders;
import org.springframework.web.context.WebApplicationContext;
import org.springframework.security.test.web.servlet.setup.SecurityMockMvcConfigurers;
import vn.iotstar.models.LoginUserModel;
import vn.iotstar.models.RegisterUserModel;

import static org.hamcrest.Matchers.*;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.get;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.post;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

@SpringBootTest
@TestMethodOrder(MethodOrderer.OrderAnnotation.class)
class JwtAuthIntegrationTests {

    @Autowired
    private WebApplicationContext context;

    private MockMvc mockMvc;

    @BeforeEach
    void setup() {
        mockMvc = MockMvcBuilders.webAppContextSetup(context)
                .apply(SecurityMockMvcConfigurers.springSecurity())
                .build();
    }

    private static String registeredEmail;
    private static String jwtToken;

    private final ObjectMapper objectMapper = new ObjectMapper();

    @Test
    @Order(1)
    void testRegisterUser() throws Exception {
        RegisterUserModel registerUser = new RegisterUserModel();
        registeredEmail = "testuser" + System.currentTimeMillis() + "@gmail.com";
        registerUser.setEmail(registeredEmail);
        registerUser.setPassword("123456");
        registerUser.setFullName("Nguyen Van Test");

        mockMvc.perform(post("/auth/signup")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(registerUser)))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.email").value(registeredEmail))
                .andExpect(jsonPath("$.fullName").value("Nguyen Van Test"));
    }

    @Test
    @Order(2)
    void testLoginSuccess() throws Exception {
        LoginUserModel loginUser = new LoginUserModel();
        loginUser.setEmail(registeredEmail);
        loginUser.setPassword("123456");

        MvcResult result = mockMvc.perform(post("/auth/login")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(loginUser)))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.token").isString())
                .andExpect(jsonPath("$.expiresIn").value(3600000L))
                .andReturn();

        String responseBody = result.getResponse().getContentAsString();
        JsonNode jsonNode = objectMapper.readTree(responseBody);
        jwtToken = jsonNode.get("token").asText();
    }

    @Test
    @Order(3)
    void testAccessUsersMeWithoutToken_ShouldBeForbidden() throws Exception {
        mockMvc.perform(get("/users/me"))
                .andExpect(status().isForbidden());
    }

    @Test
    @Order(4)
    void testAccessUsersMeWithToken_ShouldBeOk() throws Exception {
        mockMvc.perform(get("/users/me")
                        .header("Authorization", "Bearer " + jwtToken))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.email").value(registeredEmail));
    }

    @Test
    @Order(5)
    void testAccessAllUsersWithToken_ShouldBeOk() throws Exception {
        mockMvc.perform(get("/users")
                        .header("Authorization", "Bearer " + jwtToken))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$", not(empty())));
    }

    @Test
    @Order(6)
    void testViewPagesPermitAll() throws Exception {
        mockMvc.perform(get("/login"))
                .andExpect(status().isOk());

        mockMvc.perform(get("/user/profile"))
                .andExpect(status().isOk());
    }

    @Test
    @Order(7)
    void testLoginWrongPassword() throws Exception {
        LoginUserModel loginUser = new LoginUserModel();
        loginUser.setEmail("trungnh@hcmute.edu.vn");
        loginUser.setPassword("wrongpassword");

        mockMvc.perform(post("/auth/login")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(loginUser)))
                .andExpect(status().isUnauthorized())
                .andExpect(jsonPath("$.status").value(401));
    }

    @Test
    @Order(8)
    void testLoginWithTeacherAccount() throws Exception {
        LoginUserModel loginUser = new LoginUserModel();
        loginUser.setEmail("trungnh@hcmute.edu.vn");
        loginUser.setPassword("123456");

        mockMvc.perform(post("/auth/login")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(loginUser)))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.token").isString())
                .andExpect(jsonPath("$.expiresIn").value(3600000L));
    }
}
